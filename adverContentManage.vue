<!-- 自运营广告内容管理 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.searchParam" style="width: 200px" placeholder="输入ID名称或内容ID搜索" clearable
                @change="getTableList"/>
      <el-button
        icon="el-icon-search"
        type="primary"
        style="margin-left: 10px;"
        @click="search"
      >查询
      </el-button>
      <el-button
        v-permission="['AdsenseContentAdd']"
        type="primary"
        icon="el-icon-plus"
        style="margin-left:10px;"
        @click="handleAdd"
      >新增自运营广告
      </el-button>
    </div>
    <el-table
      :data="tableList"
      highlight-current-row
      border
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
      />
      <el-table-column
        prop="id"
        label="内容ID"
      />
      <el-table-column
        prop="name"
        label="ID名称"
      />
      <el-table-column
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="contentDesc"
        label="描述"
      />
      <el-table-column
        label="广告类别"
      >
        <template v-slot="scope">
          {{ scope.row.contentType | contentTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="广告形式"
      >
        <template v-slot="scope">
          {{ scope.row.contentForm | contentFormFilter }}
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="广告链接"
        show-overflow-tooltip
      />
      <el-table-column
        label="类型"
      >
        <template v-slot="scope">
          {{ scope.row.imgType | imgTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        width="200"
      >
        <template v-slot="scope">
          <div class="table-img-container">
            <img v-if="scope.row.imgType <= 6" v-for="item in scope.row.imgUrl.split(',')" :key="item" :src="item"
                 :class="'table-img-' + scope.row.imgType">
            <img v-if="scope.row.imgType === 7" :src="scope.row.coverUrl"
            :class="'table-img-' + scope.row.imgType">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="广告主"
      />
      <el-table-column
        prop="packageName"
        label="包名"
      />
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template v-slot="scope">
          <el-button
            v-permission="['AdsenseContentShow']"
            type="text"
            class="tiny-button"
            style="margin-right:10px"
            @click="handleEdit(scope.row,'showDetail')"
          >查看
          </el-button>
          <el-button
            v-permission="['AdsenseContentEdit']"
            type="text"
            class="tiny-button"
            style="margin-right:10px"
            @click="handleEdit(scope.row,'edit')"
          >编辑
          </el-button>
          <!-- <el-popconfirm
            :hide-icon="true"
            title="自运营广告删除后在app内对应位置将不再显示，是否确认删除？"
            @onConfirm="handleDel(scope.row)"
          > -->
          <el-button
            v-permission="['AdsenseContentDel']"
            slot="reference"
            type="text"
            class="tiny-button"
            @click="handleDel(scope.row)"
            :disabled="disabledId.indexOf(scope.row.id) > -1"
          >删除
          </el-button>
          <!-- </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-show="total"
        :current-page="listQuery.page.currentPage"
        :page-size="listQuery.page.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增编辑框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogStatus"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        ref="dataForm"
        :rules="formRules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left:50px;"
      >
        <el-form-item label="ID名称" prop="name">
          <el-input
            v-model="temp.name"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="ID名称"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model="temp.title"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="标题"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="contentDesc"
        >
          <el-input
            v-model="temp.contentDesc"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="描述"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="广告类别"
          prop="contentType"
          :rules="{
          required: true, message: '广告类别不能为空', trigger: 'change'
          }"
        >
          <el-select filterable v-model="temp.contentType" :disabled='showDisabled' placeholder="广告类别"
                     style="width: 300px;" clearable>
            <el-option
              v-for="item in contentTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="temp.contentType === 1 || temp.contentType === 2"
          label="广告链接"
          prop="urlNew"
          :rules="{
             required: temp.contentType === 1 || temp.contentType === 2, message: '广告链接不能为空', trigger: 'blur'
          }"
        >
          <el-input
            v-model="temp.urlNew"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="广告链接"
            style="width: 300px;"
            clearable
          />
          <span class="tips">新途2.10及以上版本使用</span>
        </el-form-item>
       
        <el-form-item
          v-if="temp.contentType === 4"
          :rules="{
            required: true, message: '跳转页面路由不能为空', trigger: 'change'
          }"
          label="跳转页面路由:" class="expand-form-model" prop="pagePath">
          <el-input
            style="width: 300px;"
            :disabled='showDisabled'
            v-model.trim="temp.pagePath"
            class="filter-item"
            placeholder="请输入跳转页面路由"
            clearable
          />
        </el-form-item>
         <el-form-item
          v-if="temp.contentType === 3"
          label="deepLink"
          prop="deepLink"
          :rules="{
             required: true, message: 'deepLink不能为空', trigger: 'blur'
          }"
        >
          <el-input
            v-model="temp.deepLink"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="请输入"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="temp.contentType === 5"
          label="TAB"
          prop="tabName"
          :rules="{
             required: true, message: 'tabName不能为空', trigger: 'blur'
          }"
        >
          <el-input
            v-model="temp.tabName"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="请输入"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <!-- 额外字段配置begin -->
        <div class="extra-details">
          <div class="title-list">
            额外字段配置：
          </div>
          <ul class="titles clearfix">
            <li class="item">字段名</li>
            <li class="item">字段值</li>
            <li class="item operate">操作</li>
          </ul>
          <!-- content -->
          <ul
            class="extra-body clearfix"
            v-for="(list, index) in temp.extra"
            :key="index"
          >
            <li class="item">
              <el-form-item :prop="`extra.${index}.key`">
                <el-input v-model.trim="list.key" :disabled='showDisabled'/>
              </el-form-item>
            </li>
            <li class="item">
              <el-form-item :prop="`extra.${index}.value`">
                <el-input v-model.trim="list.value" :disabled='showDisabled'/>
              </el-form-item>
            </li>
            <li class="item operate">
              <el-button type="primary" :disabled='showDisabled' text @click="extraDel(index)">
                删除
              </el-button
              >
            </li>
          </ul>
        </div>
        <div v-if="!showDisabled" class="total-add" @click="addExtraConfig()">
          添加配置
        </div>
        <el-form-item
          label="广告形式"
          prop="contentForm"
          :rules="{
          required: true, message: '广告形式不能为空', trigger: 'change'
          }"
        >
          <el-select filterable v-model="temp.contentForm" placeholder="广告形式" :disabled='showDisabled'
                     style="width: 300px;" clearable>
            <el-option
              v-for="item in contentFormOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="自运营广告源"
        >
          <el-select filterable v-model="temp.adsenseType" :disabled='showDisabled' placeholder="自运营广告源"
                     style="width: 300px;" clearable>
            <el-option
              key="1"
              label="小满"
              :value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="temp.adsenseType"
          :rules="{
            required: temp.adsenseType, message: '广告位标识不能为空', trigger: 'blur'
          }"
          label="广告位标识:" class="expand-form-model" prop="xmAdPostion">
          <!-- @change="(val) => {
            selectChange(val,'xmAdPostion')
          }" -->
          <el-input
            style="width: 300px;"
            :disabled='showDisabled'
            v-model.trim="temp.xmAdPostion"
            class="filter-item"
            placeholder="请输入广告位"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="temp.adsenseType"
          label="活动ID"
          prop="placeId"
          :rules="{
            required: temp.adsenseType, message: '活动ID不能为空', trigger: 'blur'
          }"
        >
          <el-input
            v-model="temp.placeId"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="活动ID"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="!temp.adsenseType"
          label="广告链接"
          prop="url"
        >
          <el-input
            v-model="temp.url"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="广告链接"
            style="width: 300px;"
            clearable
          />
          <span class="tips">新途2.9及以下版本使用</span>
        </el-form-item>
        <el-form-item label="广告类型" prop="adType">
          <el-radio-group v-model="temp.adType" :disabled='showDisabled'>
            <el-radio :label="0">广告</el-radio>
            <el-radio :label="1">活动</el-radio>
            <el-radio :label="2">资讯</el-radio>
            <el-radio :label="3">实景</el-radio>
            <el-radio :label="4">电商</el-radio>
            <el-radio :label="5">祈愿</el-radio>
            <el-radio :label="6">客服</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :rules="{
            required: true, message: '显示宽比例不能为空', trigger: 'change'
          }"
          label="显示宽比例:"  prop="withRatio">
          <el-input
            style="width: 300px;"
            :disabled='showDisabled'
            v-model.trim="temp.withRatio"
            class="filter-item"
            placeholder="请输入显示宽比例"
            clearable
          />
        </el-form-item>
        <el-form-item
          :rules="{
            required: true, message: '显示高比例不能为空', trigger: 'change'
          }"
          label="显示高比例:"  prop="heightRatio">
          <el-input
            style="width: 300px;"
            :disabled='showDisabled'
            v-model.trim="temp.heightRatio"
            class="filter-item"
            placeholder="请输入显示高比例"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="赠品:"  prop="giftName">
          <el-input
            style="width: 300px;"
            :disabled='showDisabled'
            v-model.trim="temp.giftName"
            class="filter-item"
            placeholder="赠品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="关闭按钮行为" prop="closeClickType">
          <el-radio-group v-model="temp.closeClickType" :disabled='showDisabled' @change="watchClickType">
            <el-radio :label="0">关闭弹框</el-radio>
            <el-radio :label="1">再次弹出次数</el-radio>
          </el-radio-group>
          <span v-if="temp.closeClickType === 1" class="pl10"><el-input v-model="temp.closeReshowCount" placeholder="次数" oninput="value=value.replace(/[^0-9]/g,'')" style="width:80px"/></span>
        </el-form-item>
        <el-form-item
          label="图片类型"
          prop="imgType"
          :rules="{
            required: true, message: '图片类型不能为空', trigger: 'change'
          }"
        >
          <el-select filterable v-model="temp.imgType" placeholder="图片类型" style="width: 300px;" :disabled='showDisabled'
                     clearable @change="handleTypeChange">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="temp.imgType === 7" label="视频" required>
          <el-upload
            class="avatar-uploader"
            accept=".mp4"
            :action="uploadActionUrl"
            :headers="headers"
            :before-upload="videoBeforeUpload"
            :limit="fileUploadLimit"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :on-preview="videoPreview"
            :on-success="(response, file, fileList) => {
                return onSuccess(response, file, fileList)
            }"
            :on-exceed="handleExceed"
          >
            <el-button class="filter-item" icon="el-icon-upload2" :disabled='showDisabled' type="primary" size="mini">
              点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-show="temp.imgType === 7"
          label="视频版本"
          prop="videoVersion"
        >
          <el-input-number v-model="temp.videoVersion" :disabled='showDisabled' :min="videoVersionMin" :max="videoVersionMax" label="视频版本"
          :rules="{
          required: temp.imgType === 7 && !temp.videoVersion, message: '视频版本不能为空', trigger: 'blur'
          }"></el-input-number>
        </el-form-item>
        <el-form-item v-show="temp.imgType === 7" label="是否默认静音" prop="isMute">
          <el-switch
            v-model="temp.isMute"
            class="drawer-switch"
            :active-value=1
            :inactive-value=0
            :disabled='showDisabled'
          />
        </el-form-item>
        <el-form-item v-show="temp.imgType === 7" label="占位图" :rules="{
          required: temp.imgType === 7 && !temp.imgType, message: '占位图不能为空', trigger: 'blur'
          }" prop="coverUrl">
          <el-upload
            class="avatar-uploader"
            accept=".jpg,.gif,.jpeg,.png,.webp"
            :action="uploadActionUrl"
            :headers="headers"
            :before-upload="beforeUpload"
            :limit="fileUploadLimit"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="(response, file, fileCoverList) => {
                return onCoverSuccess(response, file, fileCoverList)
            }"
            :on-exceed="handleExceed"
          >
            <el-button class="filter-item" icon="el-icon-upload2" :disabled='showDisabled' type="primary" size="mini">
              点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item v-show="temp.imgType <= 6" label="图片" required>
          <el-upload
            class="avatar-uploader"
            accept=".jpg,.gif,.jpeg,.png,.webp"
            :action="uploadActionUrl"
            :headers="headers"
            :before-upload="beforeUpload"
            :limit="fileUploadLimit"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="(response, file, fileList) => {
                return onSuccess(response, file, fileList)
            }"
            :on-exceed="handleExceed"
            :file-list="fileList"
            multiple
          >
            <el-button class="filter-item" icon="el-icon-upload2" :disabled='showDisabled' type="primary" size="mini">
              点击上传{{ temp.imgType === 4 ? '（3张）' : '1张' }}{{ '(' + ratioComputed + ')' }}
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-show="fileUrlList.length && temp.imgType <= 6"
          label="图片展示"
        >
          <img v-for="(item, index) in fileUrlList" :key="index" :src="item"
               :class='`prewImg type-img-${temp.imgType}`' class="preimg">
        </el-form-item>
        <el-form-item
          v-show="fileUrlList.length && temp.imgType == 7"
          label="占位图展示"
        >
          <img :src="temp.coverUrl"
               :class='`prewImg type-img-${temp.imgType}`' >
        </el-form-item>
        <el-form-item v-show="temp.imgType <= 6" label="备选图片" required>
          <el-upload
            class="avatar-uploader"
            accept=".jpg,.gif,.jpeg,.png,.webp"
            :action="uploadActionUrl"
            :headers="headers"
            :before-upload="beforeUpload"
            :limit="fileUploadLimitExtra"
            :on-remove="handleDoubleRemove"
            :before-remove="beforeRemove"
            :on-success="(response, file, fileDoubleList) => {
                return onDoubleSuccess(response, file, fileDoubleList)
            }"
            :on-exceed="handleExceedExtra"
            :file-list="fileDoubleList"
            multiple
          >
            <el-button class="filter-item" icon="el-icon-upload2" :disabled='showDisabled' type="primary" size="mini">
              最多上传（5张）{{ '(' + ratioComputed + ')' }}
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-show="fileDoubleUrlList.length"
          label="图片展示"
        >
          <img v-for="(item, index) in fileDoubleUrlList" :key="index" :src="item"
               :class='`prewImg type-img-${temp.imgType}`'>
        </el-form-item>
        <el-form-item label="是否有关闭按钮" prop="showClose">
          <el-radio-group v-model="temp.showClose" :disabled='showDisabled'>
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  prop="closePosition" v-if="temp.showClose===0">
          <el-radio-group v-model="temp.closePosition" :disabled='showDisabled' @change="watchClickType">
            <el-radio :label="0">显示在右上角</el-radio>
            <el-radio :label="1">显示在左上角</el-radio>
            <el-radio :label="2">显示在底部中间</el-radio>
            <el-radio :label="3">显示位置随机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="广告主"
        >
          <el-input
            v-model="temp.source"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="广告主"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <!--包名-->
        <el-form-item
          label="包名"
        >
          <el-input
            v-model="temp.packageName"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="com.xxx"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="新老用户屏蔽"
          prop="blockUsers"
          :rules="{
          required: true, message: '新老用户屏蔽不能为空', trigger: 'change'
          }"
        >
          <el-select filterable v-model="temp.blockUsers" :disabled='showDisabled' placeholder="新老用户屏蔽"
                     style="width: 300px;" clearable>
              <el-option
              v-for="item in blockUsersOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="登录用户屏蔽"
          prop="blockLogin"
          :rules="{
          required: true, message: '登录用户屏蔽不能为空', trigger: 'change'
          }"
        >
          <el-select filterable v-model="temp.blockLogin" :disabled='showDisabled' placeholder="登录用户屏蔽"
                     style="width: 300px;" clearable>
                     <el-option
              v-for="item in blockLoginOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="付费用户屏蔽"
          prop="blockPay"
          :rules="{
          required: true, message: '付费用户屏蔽不能为空', trigger: 'change'
          }"
        >
          <el-select filterable v-model="temp.blockPay" :disabled='showDisabled' placeholder="付费用户屏蔽"
                     style="width: 300px;" clearable>
                     <el-option
              v-for="item in blockPayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联收费项" v-show="temp.blockPay === 3 || temp.blockPay === 5" prop="blockPayTypes">
          <el-select filterable v-model="blockPayTypes" clearable placeholder="关联收费项" multiple :disabled='showDisabled'>
            <el-option
              v-for="(item, index) in consts.THEME_TYPE"
                :key="index"
                :label="item.title"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="倒计时"
          prop="countDown"
        >
          <el-input
            v-model="temp.countDown"
            :disabled='showDisabled'
            class="filter-item"
            placeholder="0"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否启用热区" prop="isHotAreas">
          <el-switch
            v-model="temp.isHotAreas"
            class="drawer-switch"
            :active-value=1
            :inactive-value=0
            :disabled='showDisabled'
          />
        </el-form-item>
        
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div v-if="showDisabled">
          <el-button @click="handleClose">返回</el-button>
        </div>
        <div v-else>
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === '新增' ? saveConfig() : updateConfig()"
          >确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import Api from './api/adverContentManage'
// import { dictionaryChildList } from '@/api/common'
export default {
  name: 'AdverContentManage',
  filters: {
    contentTypeFilter(value) {
      if (value === 1) {
        return '下载'
      } else if (value === 2) {
        return 'H5'
      } else if (value === 3) {
        return 'deeplink'
      } else if (value === 4) {
        return '跳转应用内页面'
      } else if (value === 5) {
        return '跳转Tab'
      } else if (value === 6) {
        return '无跳转'
      }
    },
    contentFormFilter(value) {
      if (value === 1) {
        return '信息流'
      } else if (value === 2) {
        return '开屏'
      } else if (value === 3) {
        return '插屏'
      } else if (value === 4) {
        return '小图标'
      } else if (value === 5) {
        return '文字链'
      }
    },
    imgTypeFilter(value) {
      if (value === 1) {
        return '开屏大图（1:1.78）'
      } else if (value === 2) {
        return '大图（1.78:1）'
      } else if (value === 3) {
        return '小图（1.52:1）'
      } else if (value === 4) {
        return '组图（3图）（1.52:1）'
      } else if (value === 5) {
        return '小图标（1:1）'
      } else if (value === 6) {
        return '首页顶部悬浮banner'
      } else if (value === 7) {
        return '视频'
      }
    }
  },
  data() {
    return {
      dialogType: '',
      tableList: [],
      total: 0,
      listQuery: {
        page: {
          currentPage: 1,
          pageSize: 10
        },
        searchParam: ''
      },
      dialogVisible: false,
      dialogStatus: '新增',
      videoVersionMin: 1,
      videoVersionMax: 2,
      blockPayTypes: [],
      temp: {
        id: '',
        name: '',
        title: '',
        contentDesc: '',
        contentType: '',
        contentForm: '',
        adverLink: '',
        imgType: '',
        url: '',
        xmAdPostion: '',
        source: '',
        adType: 0,
        showClose: 0,
        placeId: undefined,
        adsenseType: undefined,
        packageName: undefined,
        closeReshowCount:undefined,
        closeClickType: undefined,
        "closePosition": undefined, 
        "withRatio": undefined, //显示宽比例
        "heightRatio": undefined, //显示高比例
        "urlNew": '', //2.10版本后使用的url
        "giftName": undefined, //赠品
        pagePath: undefined,
        deepLink: undefined,
        tabName: undefined,
        extra: [
          {
            key: undefined,
            value: undefined
          }
        ],
        isMute: 1,
        isHotAreas: 1,
        coverUrl: undefined,
        videoVersion: 1,
        countDown: undefined,
        blockUsers: undefined,
        blockLogin: undefined,
        blockPay: undefined
      },
      formRules: {
        closeClickType:[
        {
            required: true,
            trigger: 'change',
            message: '请选择'
          }
        ],
        name: [
          {
            required: true,
            trigger: 'change',
            message: 'ID名称为必填项'
          }
        ],
        title: [
          {
            required: true,
            trigger: 'change',
            message: '标题为必填项'
          }
        ],
        contentDesc: [
          {
            required: true,
            trigger: 'change',
            message: '描述为必填项'
          }
        ],
        adType: [
          {
            required: true,
            trigger: 'change',
            message: '广告类型为必填项'
          }
        ]
      },
      contentTypeOptions: [
        {
          label: '下载',
          value: 1
        },
        {
          label: 'H5',
          value: 2
        },
        {
          label: 'deeplink',
          value: 3
        },
        {
          label: '跳转应用内页面',
          value: 4
        },
        {
          label: '跳转Tab',
          value: 5
        },
        {
          label: '无跳转',
          value: 6
        }
      ],
      typeOptions: [
        {
          label: '开屏大图',
          value: 1
        },
        {
          label: '大图',
          value: 2
        },
        {
          label: '小图',
          value: 3
        },
        {
          label: '组图（3图）',
          value: 4
        },
        {
          label: '小图标',
          value: 5
        },
        {
          label: '首页顶部悬浮banner',
          value: 6
        },
        {
          label: '视频',
          value: 7
        }
      ],
      contentOptions: [
        {
          label: '自运营ID1',
          value: 1
        },
        {
          label: '自运营ID2',
          value: 2
        },
        {
          label: '自运营ID3',
          value: 3
        }
      ],
      allowVerOptions: [
        {
          label: '最底支持版本',
          value: 1
        },
        {
          label: '最底支持版本2',
          value: 2
        },
        {
          label: '最底支持版本3',
          value: 3
        }
      ],
      contentFormOptions: [
        {
          label: '信息流',
          value: 1
        },
        {
          label: '开屏',
          value: 2
        },
        {
          label: '插屏',
          value: 3
        },
        {
          label: '小图标',
          value: 4
        },
        {
          label: '文字链',
          value: 5
        }
      ],
      blockUsersOptions: [
        {
          label: '不屏蔽',
          value: 1
        },
        {
          label: '屏蔽新用户',
          value: 2
        },
        {
          label: '屏蔽老用户',
          value: 3
        }
      ],
      blockLoginOptions: [
      {
          label: '不屏蔽',
          value: 1
        },
        {
          label: '屏蔽登录用户',
          value: 2
        },
        {
          label: '屏蔽未登录用户',
          value: 3
        }
      ],
      blockPayOptions: [
      {
          label: '不屏蔽',
          value: 1
        },
        {
          label: '屏蔽付费用户',
          value: 2
        },
        {
          label: '屏蔽指定商品付费用户',
          value: 3
        },
        {
          label: '屏蔽未付费用户',
          value: 4
        },
        {
          label: '屏蔽指定商品未付费用户',
          value: 5
        }
      ],
      uploadActionUrl: '/weathercms/cms/v1/shareReminder/uploadImg', // 上传图片的地址
      headers: {},
      fileList: [],
      fileDoubleList: [],
      fileUrlList: [],
      fileDoubleUrlList: [],
      disabledId: [],
      fileCoverList: [],
      fileCoverUrlList: []
    }
  },
  computed: {
    showDisabled() {
      return this.dialogType === 'showDetail'
    },
    fileUploadLimit() {
      if (this.temp.imgType === 4) {
        return 3
      } else {
        return 1
      }
    },
    fileUploadLimitExtra() {
      return 5
    },
    ratioComputed() {
      if (this.temp.imgType === 1) {
        return '1:1.78'
      } else if (this.temp.imgType === 2) {
        return '1.78:1'
      } else if (this.temp.imgType === 3) {
        return '1.52:1'
      } else if (this.temp.imgType === 4) {
        return '1.52:1'
      } else if (this.temp.imgType === 5) {
        return '1:1'
      } else {
        return ''
      }
    }
  },
  created() {
    this.getTableList()
  },
  mounted() {
    this.headers.token = getToken()
  },
  methods: {
    watchClickType(val){
      if(val === 0) {
        this.temp.closeReshowCount = 0
      }
    },
    handleRemove(file, fileList) {
      this.fileUrlList = fileList.map((item) => {
        if (item.response) {
          return item.response && item.response.data
        } else {
          return item.url
        }
      })
    },
    handleDoubleRemove(file, fileDoubleList) {
      this.fileDoubleUrlList = fileDoubleList.map((item) => {
        if (item.response) {
          return item.response && item.response.data
        } else {
          return item.url
        }
      })
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择${this.fileUploadLimit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleExceedExtra(files, fileList) {
      this.$message.warning(`当前限制选择${this.fileUploadLimitExtra}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    videoPreview(file) {
      window.open(file.url,'_blank')
    },
    getTableList() {
      Api.getTableList(this.listQuery)
        .then(res => {
          this.tableList = res.data.result
          this.total = res.data.totalCount
          this.disabledId = []
        })
    },
    search() {
      this.listQuery.page.currentPage = 1
      this.listQuery.page.pageSize = 10
      this.getTableList()
    },
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        title: '',
        contentDesc: '',
        contentType: '',
        contentForm: '',
        adverLink: '',
        imgType: '',
        url: '',
        xmAdPostion: '',
        source: '',
        adType: 0,
        showClose: 0,
        placeId: undefined,
        adsenseType: undefined,
        packageName: undefined,
        closeReshowCount:undefined,
        closeClickType: undefined,
        "closePosition": undefined, 
        "withRatio": undefined, //显示宽比例
        "heightRatio": undefined, //显示高比例
        "urlNew": '', //2.10版本后使用的url
        "giftName": undefined, //赠品
        pagePath: undefined,
        deepLink: undefined,
        tabName: undefined,
        extra: [
          {
            key: undefined,
            value: undefined
          }
        ],
        isMute: 1,
        isHotAreas: 1,
        coverUrl: undefined,
        videoVersion: 1,
        countDown: undefined,
        blockUsers: undefined,
        blockLogin: undefined,
        blockPay: undefined
      }
      this.fileList = []
      this.fileDoubleList = []
      this.fileUrlList = []
      this.fileDoubleUrlList = []
      this.fileCoverList = []
      this.fileCoverUrlList = []
      this.blockPayTypes = []
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = '新增'
      this.dialogVisible = true
    },
    handleEdit(row, type) {
      this.resetTemp()
      console.log(row)
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.title = row.title
      this.temp.contentDesc = row.contentDesc
      this.temp.contentType = row.contentType
      this.temp.contentForm = row.contentForm
      this.temp.url = row.url
      this.temp.placeId = row.placeId
      this.temp.adsenseType = row.adsenseType || undefined
      this.temp.imgType = row.imgType
      this.temp.adType = row.adType
      this.temp.xmAdPostion = row.xmAdPostion
      this.temp.closeClickType = row.closeClickType
      this.temp.closeReshowCount = row.closeReshowCount
      this.temp.isMute = row.isMute
      this.temp.isHotAreas = row.isHotAreas
      this.temp.coverUrl = row.coverUrl
      this.temp.videoVersion = row.videoVersion
      this.videoVersionMin = row.videoVersion
      this.videoVersionMax = row.videoVersion + 1
      this.temp.countDown = row.countDown
      this.temp.closePosition = row.closePosition
      this.temp.withRatio = row.withRatio
      this.temp.heightRatio = row.heightRatio
      this.temp.urlNew = row.urlNew
      this.temp.giftName = row.giftName
      this.temp.pagePath = row.pagePath
      this.temp.deepLink = row.deepLink
      this.temp.tabName = row.tabName

      if (row.blockUsers != 0) {
        this.temp.blockUsers = row.blockUsers
      }
      if (row.blockLogin != 0) {
        this.temp.blockLogin = row.blockLogin
      }
      if (row.blockPay != 0) {
        this.temp.blockPay = row.blockPay
      }
      if (row.blockPayType) {
        let tempList = row.blockPayType.split(',')
        let list = []
        tempList.forEach(item => {  
          list.push(+item);  
        }); 
        this.blockPayTypes = list
      }
      //this.temp.blockPayType = row.blockPayType.split(',')
      if (row.imgUrl) {
        this.fileUrlList = row.imgUrl.split(',')
        this.fileList = this.fileUrlList.map(item => {
          return {
            url: item,
            name: item.split('/')[item.split('/').length - 1]
          }
        })
      }
      if (row.doubleImgUrl) {
        this.fileDoubleUrlList = row.doubleImgUrl.split(',')
        this.fileDoubleList = this.fileDoubleUrlList.map(item => {
          return {
            url: item,
            name: item.split('/')[item.split('/').length - 1]
          }
        })
      }
      if (row.coverUrl) {
        this.fileCoverUrlList = row.coverUrl.split(',')
        this.fileCoverList = this.fileCoverUrlList.map(item => {
          return {
            url: item,
            name: item.split('/')[item.split('/').length - 1]
          }
        })
      }
      this.temp.source = row.source
      this.temp.packageName = row.packageName
      this.temp.showClose = row.showClose
      this.temp.extra = row.extra || [
        {
          key: undefined,
          value: undefined
        }
      ]
      this.dialogType = type
      this.dialogStatus = '编辑'
      this.dialogVisible = true
    },
    handleDel(row) {
      this.$confirm('自运营广告删除后在app内对应位置将不再显示，是否确认删除？', '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        Api.deleteConfig(row.id).then(res => {
          if (res.code === 0 || res.code === '000000') {
            this.getTableList()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          } else {
            this.disabledId.push(row.id)
          }
        })
      })
    },
    checkConfig() {
      if (((this.temp.imgType === 4) && (this.fileUrlList.length !== 3)) || ((this.temp.imgType !== 4) && (this.fileUrlList.length !== 1))) {
        this.$message({
          type: 'error',
          message: '图片未上传完善'
        })
        return false
      }
      return true
    },
    handleClose() {
      this.$refs.dataForm.resetFields()
      this.dialogVisible = false
      this.dialogType = ''
    },
    saveConfig() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (!this.checkConfig()) return false
          const jsonData = Object.assign({}, this.temp)
          if (this.temp.blockPay === 3 || this.temp.blockPay === 5) {
            jsonData.blockPayType = this.blockPayTypes.join(',')
          } else {
            jsonData.blockPayType = ''
          }
          jsonData.imgUrl = this.fileUrlList.join(',')
          jsonData.doubleImgUrl = this.fileDoubleUrlList.join(',')
          jsonData.coverUrl = this.fileCoverUrlList.join(',')
          Api.saveConfig(jsonData).then(res => {
            if (res.code === 0 || res.code === '000000') {
              this.getTableList()
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.handleClose()
            }
          })
        }
      })
    },
    updateConfig() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (!this.checkConfig()) return false
          const jsonData = Object.assign({}, this.temp)
          if (this.temp.blockPay === 3 || this.temp.blockPay === 5) {
            jsonData.blockPayType = this.blockPayTypes.join(',')
          } else {
            jsonData.blockPayType = ''
          }
          jsonData.imgUrl = this.fileUrlList.join(',')
          jsonData.doubleImgUrl = this.fileDoubleUrlList.join(',')
          jsonData.coverUrl = this.fileCoverUrlList.join(',')
          Api.updateConfig(jsonData).then(res => {
            if (res.code === 0 || res.code === '000000') {
              this.getTableList()
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.handleClose()
            }
          })
        }
      })
    },
    handleTypeChange() {
      this.fileDoubleList = []
      this.fileList = []
      this.fileDoubleUrlList = []
      this.fileUrlList = []
      this.fileCoverList = []
      this.fileCoverUrlList = []
    },
    handleSizeChange(currtPageSize) {
      this.listQuery.page.pageSize = currtPageSize
      this.getTableList()
    },
    handleCurrentChange(currentPage) {
      this.listQuery.page.currentPage = currentPage
      this.getTableList()
    },
    onSuccess(response, file, fileList) {
      this.fileUrlList = fileList.map((item) => {
        if (item.response) {
          return item.response && item.response.data
        } else {
          return item.url
        }
      })
    },
    onDoubleSuccess(response, file, fileDoubleList) {
      this.fileDoubleUrlList = fileDoubleList.map((item) => {
        if (item.response) {
          return item.response && item.response.data
        } else {
          return item.url
        }
      })
    },
    onCoverSuccess(response, file, fileCoverList) {
      this.fileCoverUrlList = fileCoverList.map((item) => {
        if (item.response) {
          return item.response && item.response.data
        } else {
          return item.url
        }
      })
    },
    beforeUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG, PNG, GIF 格式')
      }
      return isJPG
    },
    videoBeforeUpload(file) {
      console.log(file.type)
      const isJPG = ['video/mpeg4', 'video/mp4'].includes(file.type)
      if (!isJPG) {
        this.$message.error('只能上传视频格式')
      }
      return isJPG
    },
    addExtraConfig() {
      this.temp.extra.push({
        key: undefined,
        value: undefined
      })
    },
    extraDel(index) {
      if (this.temp.extra.length <= 1) {
        return false
      }
      this.temp.extra.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.prewImg{
  width: 200px;
}
.tips {
  margin-left: 10px;
  font-size: 12px;
  background-color: #fdf6ec;
  color: #e6a23c;
  cursor: default;
}
.table-img-container {
  text-align: center;
}
.table-img-container img {
  display: inline-block;
  vertical-align: top;
  width: 50px;
  margin-right: 5px;
}
.table-img-container img.table-img-1 {
  height: 89px;
}
.table-img-container img.table-img-2 {
  height: 84px;
}
.table-img-container img.table-img-3 {
  height: 32.89px;
}
.table-img-container img.table-img-4 {
  height: 32.89px;
}
.table-img-container img.table-img-5 {
  height: 50px;
}
.extra-details {
  .extra-body {
    .el-form-item{
      ::v-deep .el-form-item__content {
        margin-left: 0px!important;
        margin-right: 50px!important;
      }
    }
  }
  .titles {
    font-weight: 800;
    text-align: left;
  }
  .title-list {
    font-weight: 800;
    text-align: left;
  }
  .item {
    list-style: none;
    float: left;
    width: 35%;
  }
  .operate {
    width: 10%;
  }
}
.total-add {
  text-align: center;
  font-size: 16px;
  color: #1890ff;
  padding: 10px 0;
  width: 200px;
  border: 1px dashed #1890ff;
  cursor: pointer;
  margin: 20px auto;
}
.table-content {
  overflow-x: hidden;
}
</style>