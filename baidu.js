/*
 * @Descripttion: 汉子相关数据库操作
 * @version:
 * @Author: jun.zhang
 * @Date: 2021-04-14 15:23:58
 * @LastEditors: jun.zhang
 * @LastEditTime: 2021-04-19 15:55:48
 */
'use strict';
const egg = require('egg');
const iconv = require('iconv-lite');
const mainHost = 'https://hanyu.baidu.com/zici/s?wd=';
module.exports = class WordService extends egg.Service {
  // 获取汉字详情  -- finish
  async getWordDetail(ctx, item) {
    let word;
    if (!item) {
      word = ctx.request.body.word;
    } else {
      word = item._id;
    }
    // 从数据库获取
    let pageContent = await this.getWordDetailFromDB(word);
    if (!pageContent || !pageContent.pinyin) {
      // 数据库中不存在，从百度获取
      console.log(`数据库中不存在，从百度获取 -- ${word} --`);
      let pageDetail = await ctx.curl(`${mainHost}${word}`);
      let onlyPage = iconv.decode(pageDetail.data, 'utf-8');
      if (!onlyPage) {
        pageDetail = await ctx.curl(`${mainHost}${word}`);
        onlyPage = iconv.decode(pageDetail.data, 'utf-8');
      }
      pageContent = this.formatPageContent(onlyPage);
      pageContent = { ...pageContent, _id: word };
      // 更新数据库
      await this.updateWordDetail({ word, ...pageContent });
    }
    return pageContent;
  }
  async getWordDetailFromDB(word) {
    let { mysql } = this.app;

    let sql = `select * from chinese_words where _id ='${word}'`;
    let result = await mysql.query(sql);
    if (result && result.length) result = result[0];
    else result = null;
    return result;
  }
  async updateWordDetail(query) {
    let { word, pinyin, bihua, bishun, pinyinMp3, radical } = query;
    let { mysql } = this.app;

    let sql = `
      insert into chinese_words(_id, pinyin, bihua, bishun, pinyinMp3, radical) values
          ("${word}","${pinyin}","${bihua}","${bishun}","${pinyinMp3}","${radical}")
      ON DUPLICATE KEY UPDATE 
          pinyin = "${pinyin}",
          bihua = "${bihua}",
          bishun = "${bishun}",
          pinyinMp3 = "${pinyinMp3}",
          radical = "${radical}"
      `;
    console.log('sql', sql);
    let result = await mysql.query(sql);
    return result;
  }

  formatPageContent(orignData) {
    let regMain = orignData.split('<div id="word-header" class="header-info">')[1];
    let [main1,mainOther] = regMain.split('</ul>');
    let temp = main1.match(/<img id="word_bishun" class="bishun" data-gif="https:\/\/hanyu-word-gif\.cdn\.bcebos\.com\/(.*?)\.gif" src="/);
    let bishun = temp ? temp[1] : '';
    let main2 = main1.split('<div class="pronounce" id="pinyin">')[1];
    let pinyin = main2.match(/<b>(.*?)<\/b>/)[1];

    let pinyinMp3 = main2.match(/<a herf="#" url="https:\/\/hanyu-word-pinyin-short.cdn.bcebos.com\/(.*?)\.mp3" class="mp3-play">/)[1];
    let main3 = main2.split('<li id="radical">')[1];
    let radical = main3.match(/<span>(.*?)<\/span>/)[1];
    main3 = main3.split('<label>笔 画</label>')[1];
    let bihua = main3.match(/<span>(.*?)<\/span>/)[1];
    return {
      bishun,
      pinyin,
      pinyinMp3,
      radical,
      bihua,
    };
  }
  // 获取词语
  getTerms(orignData){
    let main = orignData.split('<h1><b class="title" id="related_term">相关组词</b></h1>')[1];
    main = main.split('</div>')[0];
    // 获取词语
    let reg = /<a href="\?wd=.*?&ptype=term">(.*)<\/a>/g;
    let all = main.matchAll(reg);
    
    let val = all.next();
    let terms = [];
    
    do {
      terms.push(val.value[1]);
      val = all.next();
    } while (!val.done);
    // 如何处理词语 ？
  }
  // 获取

};
