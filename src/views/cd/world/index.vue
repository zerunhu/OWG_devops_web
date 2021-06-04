<template>
  <div class="app-container" >
    <el-select style="width:220px;" v-model="value" placeholder="请选择cluster环境" @change="changeCluster">
        <el-option
          v-for="item in ClusterList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
    </el-select>
    <el-row style="float:right;margin-top: 15px;margin-right:25px;"  v-if="value!=''">
        <el-button size="medium" type="primary" icon="el-icon-copy-document" v-if="checkPermission(['WORLD_CREATE'])" @click="createHandle()" style="height:40px;" >New {{ typeActiveName }}</el-button>
    </el-row>
    <el-row style="float:right;margin-top: 15px;margin-right:35px;"  v-if="value=='firestrike-oregon-prod-2' && checkPermission(['WORLD_SERVERLIST', 'WORLD_CLIENTLIST', 'WORLD_NOTICE']) && typeActiveName=='world'">
        <el-button size="medium" type="primary" icon="el-icon-upload" @click="cloudFront.dialogVisible=true" style="height:40px;">CloudFront</el-button>
    </el-row>
    <!-- <el-row style="float:right;margin-top: 15px;margin-right:35px;"  v-if="value=='firestrike-oregon-prod-2'">
        <el-button size="medium" type="primary" icon="el-icon-upload" @click="notice.dialogNoticeVisible=true" v-if="checkPermission(['admin']) && typeActiveName=='world'" style="height:40px;">notice</el-button>
    </el-row> -->
    <el-tabs style="margin-top: 10px" type="card" v-model="typeActiveName" @tab-click="typehandleClick" v-if="value!=''">
      <el-tab-pane label="world" name="world"></el-tab-pane>
      <el-tab-pane label="copymap" name="copymap"></el-tab-pane>
    </el-tabs>
    <el-card class="box-card" shadow="hover" :style="value!='' ? 'margin-top:-16px' : 'margin-top:10px'" :body-style="{ padding: '10px' }">
      <el-button size="small"  icon="el-icon-odometer" v-if="checkPermission(['WORLD_UPDATE']) && value != ''" @click="beforeUpdate()">Upgrade</el-button>
      <el-button size="small"  icon="el-icon-document-copy" v-if="checkPermission(['WORLD_BACKUP']) && value != ''" @click="beforeBackup()">Backup</el-button>
      <el-button size="small"  icon="el-icon-collection" v-if="checkPermission(['WORLD_SECURITYGROUP']) && value == 'firestrike-oregon-prod-2' && typeActiveName == 'world'" @click="beforeSecurityGroup()">Security</el-button>
      <el-button size="small"  icon="el-icon-data-analysis" v-if="checkPermission(['WORLD_UPDATE','WORLD_BACKUP','WORLD_SECURITYGROUP']) && value != ''" @click="operateHistory()">Result</el-button>
    </el-card>
    <el-row>
        <el-table :data="tableDataList.slice((pagination.world.currentPage-1)*pagination.world.size,pagination.world.currentPage*pagination.world.size)" 
          :row-key="getRowKeys" 
          border fit highlight-current-row 
          style="width: 100%" tooltip-effect="dark" 
          ref="multipleTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed align="center" min-width="90" :reserve-selection="true"></el-table-column>
          <el-table-column label="name" fixed align="center" min-width="130px">
            <template slot-scope="scope"> {{ scope.row.name  }} </template>
          </el-table-column>
          <el-table-column label="create_time" align="center" min-width="150px" sortable prop="create_time"> 
            <template slot-scope="scope"> {{ scope.row.create_time.split(".")[0] }}</template>
          </el-table-column>
          <el-table-column label="update_time" align="center" min-width="150px">
            <template slot-scope="scope"> {{ scope.row.update_time.split(".")[0] }} </template>
          </el-table-column>
          <el-table-column label="image_tag" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.image_tag }} </template>
          </el-table-column>
          <el-table-column label="prod_name" align="center" min-width="100px" >
            <template slot-scope="scope"> {{ scope.row.prod_name }} </template>
          </el-table-column>
          <el-table-column label="copymap" align="center" min-width="170px" v-if="this.typeActiveName == 'world'"> 
            <template slot-scope="scope"> {{ scope.row.copymap }}</template>
          </el-table-column>
          <el-table-column label="healthy_check" align="center" min-width="120px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.healthy === 'Healthy' ? 'success' : 'info'">
                {{ scope.row.healthy }}
              </el-tag>
              <el-tooltip class="item" effect="dark" content="get world healthy" placement="top">
                <a :class="scope.row.healthy_class" @click="GetWorldStatus(scope.row)"></a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="port_open" align="center" min-width="120px" v-if="checkPermission(['WORLD_SECURITYGROUP']) && value=='firestrike-oregon-prod-2' && typeActiveName=='world'">
            <template slot-scope="scope">
              <el-tag :type="scope.row.port_open === true ? 'success' : 'info'">
                {{ scope.row.port_open === true ? 'open' : 'close' }}
              </el-tag>
              <el-tooltip class="item" effect="dark" :content="scope.row.port_open === true ? 'forcing players offline and close port':'open port'" placement="top">
                <a :class="scope.row.port_open === true ? scope.row.port_open_class : scope.row.port_close_class" @click="ConfirmPortOpen(scope.row)"></a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="360px">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-chat-line-square" @click="getHistory(scope.row.id)" v-if="checkPermission(['WORLD_HISTORY'])">History</el-button>
              <el-button size="small" type="primary" icon="el-icon-s-tools" v-if="checkPermission(['WORLD_CLEARDEADNUMBER','WORLD_AUTOCLEARDEADNUMBER']) && value=='firestrike-oregon-prod-2' && typeActiveName == 'world'" @click="gmTool.Visible=true;gmTool.pk=scope.row.id">GmTool</el-button>
              <el-button size="small" type="warning" icon="el-icon-refresh-left" v-if="checkPermission(['WORLD_RESTART']) && typeActiveName == 'world'" @click="restrtApp.dialogRestartFormVisible=true;restrtApp.restart_world_id=scope.row.id">Restart</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" v-if="checkPermission(['WORLD_DELETE'])" @click="deleteConfirm(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-left:40%">
          <el-pagination
            :hide-on-single-page=true
            @current-change="paginationWorldCurrentChange"
            :current-page="pagination.world.currentPage"
            layout="prev, pager, next"
            :page-size=pagination.world.size
            :total=tableDataList.length>
          </el-pagination>
        </div>
    </el-row>

    <!-- reallog dialog、 -->
    <el-dialog title="RealLog" :visible.sync="realLog.dialogRealLogVisible" width="50%" :closeOnClickModal=false :closeOnPressEscape=false :showClose=false>
      <div class="dialogStyle" id="scroll">
        <span class="comment" > {{ realLog.dialog_data }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="destry()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- create dialog、 -->
    <el-dialog title="Create" :visible.sync="createForm.dialogCreateFormVisible" width="40%" :closeOnClickModal=false :closeOnPressEscape=false :showClose=false>
      <el-form :model="createForm">
        <el-form-item label="cluster_name" label-width="110px">
          <el-input v-model="this.value" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="typeActiveName+'_id'" label-width="110px">
          <el-input v-model="createForm.world_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="prod_name" label-width="110px" v-if="value=='firestrike-oregon-prod-2'">
          <el-input v-model="createForm.prod_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="image_tag" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="createForm.image_tag" placeholder="请选择镜像版本">
            <el-option
              v-for="item in ImageList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="copymap" label-width="110px" v-if="typeActiveName=='world'">
          <el-select style="width:220px;" filterable  v-model="createForm.copymap" placeholder="选择副本服务器">
            <el-option
              v-for="item in createForm.copymapList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createForm.dialogCreateFormVisible = false; dialogDestry('创建操作')">取 消</el-button>
        <el-button type="primary" @click="createWorld()">确认</el-button>
      </div>
    </el-dialog> 
    <!-- 更新dialog、 -->
    <el-dialog title="Update" :visible.sync="updateForm.dialogUpdateFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="updateForm">
        <el-form-item :label="updateForm.label_name" label-width="110px">
          <el-input v-model="batchOperate.multipleName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="image_tag" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="updateForm.image_tag" placeholder="请选择镜像版本">
            <el-option
              v-for="item in ImageList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateForm.dialogUpdateFormVisible = false; dialogDestry('更新操作')">取 消</el-button>
        <el-button type="primary" @click="updateWorld()">确认</el-button>
      </div>
    </el-dialog>
    <!-- backup dialog -->
    <el-dialog title="Backup" :visible.sync="backupForm.dialogBackupFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form>
        <el-form-item label="world_name" label-width="110px">
          <el-input v-model="batchOperate.multipleName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <p style="margin-left:15px">请确认上述需要备份的服务器列表！ </p>
        <p style="margin-left:15px">请确认服务器已经对外停止工作！备份操作将<b style="color:red">关闭所有应用</b>并暂停数据库！ </p>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px">
        <el-button @click="backupForm.dialogBackupFormVisible = false; dialogDestry('备份操作')">取 消</el-button>
        <el-button type="primary" @click="BackupRedis()">确认</el-button>
      </div>
    </el-dialog>
    <!-- switch securitygroup dialog -->
    <el-dialog title="securityGroup" :visible.sync="batchSecurityGroup.dialogVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form>
        <el-form-item label="world_name" label-width="110px">
          <el-input v-model="batchOperate.multipleName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <p style="margin-left:15px">请确认上述需要切换安全组策略的服务器列表！ </p>
        <p style="margin-left:15px">同时请确认服务器已经对外停止工作！此操作将<b style="color:red">关闭所有服务端入口，并且强制踢除玩家下线</b></p>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px">
        <el-button @click="batchSecurityGroup.dialogVisible = false; dialogDestry('安全组操作')">取 消</el-button>
        <el-button type="primary" @click="batchUpdateSecurityGroup()">确认</el-button>
      </div>
    </el-dialog>

    <!-- gotool dialog、 -->
    <el-dialog title="GmTool Operation" :visible.sync="gmTool.Visible" width="40%" :closeOnClickModal=false>
      <el-tabs type="card" v-model="gmTool.activeName" @tab-click="gmToolTabClick" style="margin-top:-30px;">
        <el-tab-pane label="clearDeadNumber" name="clearDeadNumber" v-if="checkPermission(['WORLD_CLEARDEADNUMBER'])">
          <el-button :loading=gmTool.isClearLoading type="primary" @click="clearDeadNumber()">清理死号</el-button>
        </el-tab-pane>
        <el-tab-pane label="autoClearDeadNumber" name="autoClearDeadNumber" v-if="checkPermission(['WORLD_AUTOCLEARDEADNUMBER'])">
          <p>当前自动清理死号的接口状态是：<b style="color:red"> {{gmTool.auto_is_open_context}} </b></p> 
          <el-button :loading=gmTool.isgetAutoLoading type="primary" @click="getAutoClearDeadNumber()">获取自动清理接口状态</el-button>
          <el-button :loading=gmTool.isswitchAutoLoading type="primary" @click="switchAutoClearDeadNumber()">修改自动清理接口状态</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- result dialog、 -->
    <el-dialog title="Batch operation result" :visible.sync="batchResult.dialogResultVisible" width="40%" :closeOnClickModal=false>
      <el-tabs type="card" v-model="batchResult.activeName" @tab-click="batchResultTabClick" style="margin-top:-30px;">
        <el-tab-pane label="update" name="update">
          <el-table :data="batchResult.data.slice((pagination.operatehistory.currentPage-1)*pagination.operatehistory.size,pagination.operatehistory.currentPage*pagination.operatehistory.size)" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="Revision" min-width="65">
              <template slot-scope="scope">
                <span>{{ scope.row.revision }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="World" min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.world }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" align="center" label="Date">
              <template slot-scope="scope">
                <span>{{ scope.row.time.split(".")[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" align="center" min-width="110">
              <template slot-scope="scope">
                <el-tag :type="scope.row.result | statusFilter">
                  {{ scope.row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Reason" min-width="110">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showResultReason(scope)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-left:40%">
            <el-pagination
              :hide-on-single-page=true
              @current-change="paginationOperateCurrentChange"
              :current-page="pagination.operatehistory.currentPage"
              layout="prev, pager, next"
              :page-size=pagination.operatehistory.size
              :total=batchResult.data.length>
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="backup" name="backup">
          <el-table :data="batchResult.data.slice((pagination.operatehistory.currentPage-1)*pagination.operatehistory.size,pagination.operatehistory.currentPage*pagination.operatehistory.size)" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="Revision" min-width="65">
              <template slot-scope="scope">
                <span>{{ scope.row.revision }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="World" min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.world }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" align="center" label="Date">
              <template slot-scope="scope">
                <span>{{ scope.row.time.split(".")[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" align="center" min-width="110">
              <template slot-scope="scope">
                <el-tag :type="scope.row.result | statusFilter">
                  {{ scope.row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Reason" min-width="110">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showResultReason(scope)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-left:40%">
            <el-pagination
              :hide-on-single-page=true
              @current-change="paginationOperateCurrentChange"
              :current-page="pagination.operatehistory.currentPage"
              layout="prev, pager, next"
              :page-size=pagination.operatehistory.size
              :total=batchResult.data.length>
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="securityGroup" name="securityGroup">
          <el-table :data="batchResult.data.slice((pagination.operatehistory.currentPage-1)*pagination.operatehistory.size,pagination.operatehistory.currentPage*pagination.operatehistory.size)" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="Revision" min-width="65">
              <template slot-scope="scope">
                <span>{{ scope.row.revision }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="World" min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.world }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" align="center" label="Date">
              <template slot-scope="scope">
                <span>{{ scope.row.time.split(".")[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" align="center" min-width="110">
              <template slot-scope="scope">
                <el-tag :type="scope.row.result | statusFilter">
                  {{ scope.row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Reason" min-width="110">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showResultReason(scope)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-left:40%">
            <el-pagination
              :hide-on-single-page=true
              @current-change="paginationOperateCurrentChange"
              :current-page="pagination.operatehistory.currentPage"
              layout="prev, pager, next"
              :page-size=pagination.operatehistory.size
              :total=batchResult.data.length>
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- showResultReason  -->
    <el-dialog :title="batchResult.reason.title" :visible.sync="batchResult.dialogResultReasonVisible" width="28%" :closeOnClickModal=false :closeOnPressEscape=false>
      <el-card class="box-card" style="margin-top:-20px;" :body-style="{ padding: '10px' }">
        <p style="white-space:pre-line;margin:0px;">
          {{ batchResult.reason.content }}
        </p>
      </el-card>
    </el-dialog>

    <!-- history dialog、 -->
    <el-dialog title="World History" :visible.sync="history.dialogFormVisible" width="40%" :closeOnClickModal=false>
      <p style="margin-top: -25px;"> 按倒叙排列显示最新十次更新 </p>
      <el-table :data="history.DataList" style="width: 100%">
        <el-table-column label="revision" align="center" min-width="80px">
          <template slot-scope="scope"> {{ scope.row.revision }} </template>
        </el-table-column>
        <el-table-column label="image_tag" align="center" min-width="180px">
          <template slot-scope="scope"> {{ scope.row.image_tag }} </template>
        </el-table-column>
        <el-table-column label="update_time" align="center" min-width="180px">
          <template slot-scope="scope"> {{ scope.row.update_time }} </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- restartapp dialog、 -->
    <el-dialog title="World Restart App" :visible.sync="restrtApp.dialogRestartFormVisible" width="40%" :closeOnClickModal=false>
      <div style="margin: -15px 0 20px 0;font-size:15px;">请选择需要重启的应用，请不要在不确定的情况下选择重启redis</div>
      <el-checkbox :indeterminate="restrtApp.isIndeterminate" v-model="restrtApp.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="restrtApp.checkedApps" @change="handleCheckedAppsChange">
        <el-checkbox v-for="app in restrtApp.apps" :label="app" :key="app">{{app}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer" style="margin-top: -15px;">
        <el-button @click="restrtApp.dialogRestartFormVisible = false; dialogDestry('重启操作')">取 消</el-button>
        <el-button type="primary" :loading=restrtApp.isRestartLoading @click="RestartApp()">确认</el-button>
      </div>
    </el-dialog>

    <!-- cloudfront -->
    <el-dialog title="CloudFront" :visible.sync="cloudFront.dialogVisible" width="40%" :closeOnClickModal=false>
      <el-tabs type="card" v-model="cloudFront.ActiveName" style="margin-top:-20px">
        <!-- serverlist -->
        <el-tab-pane label="serverlist" name="serverlist" style="margin-top:10px;margin-left:10px" v-if="checkPermission(['WORLD_SERVERLIST'])">
          <el-upload
          class="upload-demo"
          ref="supload"
          action=""
          :http-request="serverListHttpRequest"
          :auto-upload="false">
            <el-button slot="trigger" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip" style="font-size:16px;margin-top:10px;">只能上传文件，且不超过1mb</div>
          </el-upload>
          <div style="margin-top:30px;float:right;margin-right:30px">
            <el-button type="primary" @click="online_serverlist.dialogEditonlineVisible=true;serverlist.dialogServerlistVisible=false" v-if="checkPermission(['WORLD_SERVERLISTONLINE'])">在线编辑</el-button>
            <el-button type="primary" :loading=serverlist.isServerlistLoading @click="submitUpload">Update</el-button>
          </div>
        </el-tab-pane>
        <!-- client serverlist -->
        <el-tab-pane label="clientlist" name="clientlist" v-if="checkPermission(['WORLD_CLIENTLIST'])">
          <el-form :model="clientlist" :rules="rules" style="margin-top:10px">
            <el-form-item label="clientversion" label-width="110px" prop="clientversion">
              <el-input v-model="clientlist.clientversion" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-upload style="margin-left:10px"
          class="upload-demo"
          ref="cupload"
          action=""
          :http-request="clientListHttpRequest"
          :auto-upload="false">
            <el-button slot="trigger" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip" style="font-size:16px;margin-top:10px;">只能上传文件，且不超过500kb</div>
          </el-upload>
          <div style="margin-top:30px;float:right;margin-right:30px">
            <el-button type="primary" :loading=serverlist.isServerlistLoading @click="clientSubmitUpload" :disabled="clientlist.disable">Update</el-button>
          </div>
        </el-tab-pane>
        <!-- notice  -->
        <el-tab-pane label="notice" name="notice" v-if="checkPermission(['WORLD_NOTICE'])">
          <el-form :model="notice" :rules="rules">
            <el-form-item label="old_version" label-width="110px" prop="old_version">
              <el-input v-model="notice.old_version" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="new_version" label-width="110px" prop="new_version">
              <el-input v-model="notice.new_version"></el-input>
            </el-form-item>
          </el-form>
          <p style="margin-top: 5px;margin-left: 15px;">请填写客户端版本号，玩家在打开旧版本客户端时弹出提示，要求玩家升级到新版本</p>
          <br>
          <p style="margin-top: -10px;margin-left: 15px;color:red">格式: x.x.x  (x表示为数字)</p>
          <div style="margin-top:30px;float:right;margin-right:30px">
            <el-button type="primary" :loading=notice.isNoticeLoading @click="updateNotice" :disabled="notice.disablenew || notice.disableold">Update</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- serverlist update editonline dialog -->
    <el-dialog title="Update ServerList" :visible.sync="online_serverlist.dialogEditonlineVisible" width="40%" :closeOnClickModal=false>
      <el-form :model="online_serverlist" :rules="rules"> 
        <el-form-item label="version" label-width="80px" prop="version" :validate-event="false">
          <el-input v-model="online_serverlist.version" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <p style="margin-top: 5px;margin-left: 15px;"> 请填写需要修改的客户端版本号 </p>
      <br>
      <p style="margin-top: -20px;margin-left: 15px;color:red">格式: x.x.x  (x表示为数字)</p>
      <div slot="footer" class="dialog-footer"  style="margin-top: -35px;">
        <router-link style="margin-right:15px" :to="{path:'/deploy/world/serverlist/',query:{cluster_name:this.value,serverlist_version:this.online_serverlist.version}}"><el-button type="primary" :disabled="serverlist.disable">确认</el-button></router-link>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { getCluster,getWorld,createWorld,getImages,updateWorld,deleteWorld,GetRealLog,DeleteRealLog,GetWorldStatus,getHistory,RestartApp,BackupRedis,UpdateSecurityGroup,batchUpdateSecurityGroup,UpdateServerList,UpdateClientList,updateNotice,operateHistory,clearDeadNumber,switchAutoClearDeadNumber,getAutoClearDeadNumber } from '@/api/cd/world.js'
import checkPermission from '@/utils/permission'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        SUCCESS: 'success',
        EXECUTING: 'info',
        FAILED: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    let reg = /^\d+\.\d+\.\d+$/
    var checkVersion_clientlist = (rule, value, callback) => {
      if (!reg.test(value)) {
        this.clientlist.disable = true
        callback(new Error('请按照格式规定输入version'))
      } else {
        this.clientlist.disable = false
        callback()
      }
    }
    var checkVersion_serverlist = (rule, value, callback) => {
      if (!reg.test(value)) {
        this.serverlist.disable = true
        callback(new Error('请按照格式规定输入version'))
      } else {
        this.serverlist.disable = false
        callback()
      }
    }
    var checkVersion_noticenew = (rule, value, callback) => {
      if (!reg.test(value)) {
        this.notice.disablenew = true
        callback(new Error('请按照格式规定输入version'))
      } else {
        this.notice.disablenew = false
        callback()
      }
    }
    var checkVersion_noticeold = (rule, value, callback) => {
      if (!reg.test(value)) {
        this.notice.disableold = true
        callback(new Error('请按照格式规定输入version'))
      } else {
        this.notice.disableold = false
        callback()
      }
    }

    return {
      ClusterList: [],   //cluster选择
      value: "",         //cluster选择的值
      tableDataList: [], //world列表
      ImageList: [],     //镜像列表

      typeActiveName: "world", //不同的创建面板
      
      pagination: {
        world: {
          currentPage: 1,
          size: 10,
        },
        operatehistory: {
          currentPage: 1,
          size: 5,
        },
      },

      gmTool: {
        Visible: false,
        activeName: "clearDeadNumber",
        pk: "",
        auto_is_open: "",
        auto_is_open_context: "获取错误",
        isClearLoading: false,
        isgetAutoLoading: false,
        isswitchAutoLoading: false,
      },

      cloudFront: {
        dialogVisible: false,
        ActiveName: "serverlist",
      },
      clientlist: {
        clientversion: "",
        fileList: [],
        isLoading: false,
        disable: true,
      },
      serverlist: {
        fileList: [],
        dialogServerlistVisible: false,
        isServerlistLoading: false,
        disable: true,
      },
      online_serverlist: {
        version: "",
        dialogEditonlineVisible: false,
      },
      notice: {
        old_version: "",
        new_version: "",
        isNoticeLoading: false,
        dialogNoticeVisible: false,
        disableold: true,
        disablenew: true,
      },
      //notice新旧版本验证规则
      rules:{
        old_version: [
          { validator: checkVersion_noticeold, trigger: 'blur' }
        ], 
        new_version: [
          { validator: checkVersion_noticenew, trigger: 'blur' }
        ], 
        version: [
          { validator: checkVersion_serverlist, trigger: 'blur' }
        ], 
        clientversion: [
          { validator: checkVersion_clientlist, trigger: 'blur' }
        ], 
      },
      createForm: {
        world_id: "",
        cluster_name: "",
        image_tag: "",
        label_name: "world_id",
        prod_name: "Planet #",
        dialogCreateFormVisible: false,
        copymap: "",
        copymapList: []
      },
      updateForm: {
        image_tag: "",
        label_name: "world_name",
        dialogUpdateFormVisible: false,
      },
      backupForm: {
        dialogBackupFormVisible: false,
      },
      batchSecurityGroup: {
        dialogVisible: false,
      },
      batchOperate: {
        multipleId: [],
        multipleName: "",
      },
      batchResult: {
        dialogResultVisible: false,
        dialogResultReasonVisible: false,
        data: [],
        activeName: "update",
        reason: {
          content: "",
          title: "",
        },
      },
      restrtApp: {
        restart_world_id: "",
        checkedApps: ['map', 'stateless', 'center', 'gate', 'logic'],
        apps: ['map', 'stateless', 'center', 'gate', 'logic', 'redis'],
        dialogRestartFormVisible: false,
        isRestartLoading: false,
        isIndeterminate: true,
        checkAll: false,
      },
      history: { 
        DataList: [],   
        dialogFormVisible: false,
      },
      realLog: {
        path: "",
        timer: "",
        dialog_data: "Loading...",
        dialogRealLogVisible: false,
      },
    }
  },
  mounted: function () {
    this.getCluster()
  },
  methods: {
    checkPermission(roles){
      if ( this.value.indexOf("dev") != -1 ){
        roles.forEach((item, index, input) =>{
          input[index] = "DEV_" + item 
        })
      }else if ( this.value.indexOf("qa") != -1 ){
        roles.forEach((item, index, input) =>{ 
          input[index] = "QA_" + item 
        })
      }else if ( this.value.indexOf("prod") != -1 ){
        roles.forEach((item, index, input) =>{
          input[index] = "PROD_" + item 
        })
      }
      return checkPermission(roles)
    },

    //get cluster prod/dev
    getCluster(){
      getCluster()
        .then(response => {
            this.ClusterList = response
        }, response => {
            console.log(response);
        }) 
    },

    changeCluster(){
      this.getWorld()
      this.getImages()
      this.clearData()
      this.batchOperate.multipleId = []
      this.batchOperate.multipleName = ""
      this.$refs.multipleTable.clearSelection();
    },

    // switch world type world/global
    typehandleClick(tab, event) {
      this.getWorld()
      this.clearData()
      this.batchOperate.multipleId = []
      this.batchOperate.multipleName = ""
      this.$refs.multipleTable.clearSelection();
    },

    //get world  and set init value 
    getWorld(){
      getWorld(this.value,this.typeActiveName)
        .then(response => {
            this.tableDataList = response.map(v =>{
              // this.createForm.copymapList.push(v.name)
              this.$set(v,"healthy", "NoData")
              this.$set(v,"healthy_class", "el-icon-refresh-left healthy_stsyle")
              this.$set(v,"port_open_class", "el-icon-open healthy_stsyle" )
              this.$set(v,"port_close_class", "el-icon-turn-off healthy_stsyle")
              return v
            })
        }, response => {
            console.log(response);
        }) 
    },

    //get world status healthy
    GetWorldStatus(row){
      this.$set(row, "healthy_class", "el-icon-loading healthy_stsyle")
      GetWorldStatus(row.id)
        .then(response => {
          this.$set(row,"healthy",response)
          this.$set(row, "healthy_class", "el-icon-refresh-left healthy_stsyle")
        }, response => {
          console.log(response);
          this.$set(row, "healthy_class", "el-icon-refresh-left healthy_stsyle")
      })
    },
     
    //create world
    createHandle(){
      this.createForm.copymapList=[]
      this.createForm.dialogCreateFormVisible=true
      getWorld(this.value,"copymap")
        .then(response => {
            response.map(v =>{
              this.createForm.copymapList.push(v.name)
            })
        }, response => {
            console.log(response);
      }) 
    },
    createWorld() {
      this.createForm.dialogCreateFormVisible=false
      this.realLog.dialogRealLogVisible = true
      this.realLog.path = '/tmp/create_world.log'
      if ( this.value=="firestrike-singapore-dev" ){
        this.createForm.prod_name=""
      }
      createWorld({ cluster: this.value, world_id: this.createForm.world_id, image_tag: this.createForm.image_tag, prod_name: this.createForm.prod_name, type: this.typeActiveName, copymap: this.createForm.copymap })
        // .then(response => {
        //   clearInterval(this.realLog.timer)
        //   this.getData()
        // }, response => {
        //   clearInterval(this.realLog.timer)
        //   this.getData()
        //   console.log(response);
        // });
        .then(response => {
          if (response.status == 500){
            this.realLog.dialogRealLogVisible = false,
            this.$message({
              type: 'warning',
              duration: 8000,
              message: response.msg
            });
          }
          clearInterval(this.realLog.timer)
          this.getData()
        }, response => {
          clearInterval(this.realLog.timer)
          this.getData()
          console.log(response);
        })
      this.realLog.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 3000)
      this.createForm.world_id=""
    },

    //get images to update 
    getImages(){
      getImages(this.value)
        .then(response => {
          this.ImageList=response 
        }, response => {
          console.log(response);
        }) 
    },
    //update world 
    beforeUpdate(){
      if(this.batchOperate.multipleName==""){
        this.$message({
          message: '请先选择需要更新的world',
          type: 'warning'
        });
      }else{
        this.updateForm.dialogUpdateFormVisible = true;
      }
    },
    updateWorld() {
      this.updateForm.dialogUpdateFormVisible=false,
      this.batchResult.activeName = "update"
      updateWorld( { world_list: this.batchOperate.multipleId, image_tag: this.updateForm.image_tag, type: this.typeActiveName, cluster: this.value }) 
        .then(response => {
          if (response.status == 500){
            this.$message({
              type: 'warning',
              duration: 8000,
              message: response.msg
            });
          }else{
            this.$notify({
              title: '更新开始', 
              // type: 'success',
              message: this.$createElement('i', { style: 'color: teal'}, '更新已经开始,请前往Result界面查看结果')
            });
          }
      }, response => {
          console.log(response);
      }) 
    },
    //operateHistory
    operateHistory(){
      this.batchResult.dialogResultVisible = true,
      operateHistory(this.batchResult.activeName,this.value,this.typeActiveName)
        .then(response => {
          this.batchResult.data = response
        }, response => {
          console.log(response);
        });
    },
    batchResultTabClick(){
      this.pagination.operatehistory.currentPage=1
      this.operateHistory()
    },
    showResultReason(scope){
      this.batchResult.dialogResultReasonVisible = true
      this.batchResult.reason.content = scope.row.reason
      this.batchResult.reason.title = scope.row.world
    },

    //get world update history
    getHistory(pk){
      this.history.dialogFormVisible = true
      getHistory(pk)
        .then(response => {
            this.history.DataList = response
        }, response => {
            console.log(response);
        }) 
    },

    //delete world
    deleteConfirm(row) {
      this.$prompt('请确认你要删除的world_id,例如要删除firestrike-world1请输入1', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (row.name.split("firestrike-"+this.typeActiveName)[1] == value){
            return true
          }else{
            return "world_id不匹配"
          }
        },
      }).then(({value}) => {
        this.deleteWorld(row.id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除操作'
        });
      });
    },
    deleteWorld(pk){
      this.realLog.dialogRealLogVisible = true,
      this.realLog.path = '/tmp/delete_world.log',
      deleteWorld(pk)
        .then(response => {
          clearInterval(this.realLog.timer)
          this.getData()  
        }, response => {
          clearInterval(this.realLog.timer)
          this.getData()
          console.log(response);
        }) 
      this.realLog.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 3000)
    },


    //backup redis data and mkdir bak dir
    // backupConfirm(row) {
    //   this.$prompt('请确认服务器已经对外停止工作！备份操作将关闭所有应用并暂停数据库！ 请输入需要更新的服务器名称确认备份。 ', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     closeOnClickModal: false,
    //     inputValidator: (value) => {
    //       if (row.name == value){
    //         return true
    //       }else{
    //         return "world_name不匹配"
    //       }
    //     },
    //   }).then(() => {
    //     this.BackupRedis(row.id);
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消备份操作',
    //     });
    //   });
    // },
    beforeBackup(){
      if(this.batchOperate.multipleName==""){
        this.$message({
          message: '请先选择需要备份的world',
          type: 'warning'
        });
      }else{
        this.backupForm.dialogBackupFormVisible = true;
      }
    },
    BackupRedis(){
      this.backupForm.dialogBackupFormVisible=false
      this.$notify({
        title: '备份开始', 
        // type: 'success',
        message: this.$createElement('i', { style: 'color: teal'}, '备份已经开始,请前往Result界面查看结果')
      });
      this.batchResult.activeName = "backup"
      BackupRedis({ world_list: this.batchOperate.multipleId, cluster: this.value })
      .then(response => {
        console.log(response);
      }) 
    },

    //check restart app select checkbox 
    handleCheckAllChange(val) {
      this.restrtApp.checkedApps = val ? this.restrtApp.apps : [];
      this.restrtApp.isIndeterminate = false;
    },
    handleCheckedAppsChange(value) {
      let checkedCount = value.length;
      this.restrtApp.checkAll = checkedCount === this.restrtApp.apps.length;
      this.restrtApp.isIndeterminate = checkedCount > 0 && checkedCount < this.restrtApp.apps.length;
    },
    //restart world app
    RestartApp(){
      this.restrtApp.isRestartLoading = true,
      RestartApp(this.restrtApp.restart_world_id,{"apps": this.restrtApp.checkedApps})
      .then(response => {
          this.restrtApp.isRestartLoading = false,
          this.restrtApp.dialogRestartFormVisible = false,
          this.$message({
            type: 'success',
            message: '重启成功'
          });
          console.log(response);
      }, response => {
          console.log(response);
      }) 
    },

    /// update serverlist
    serverListHttpRequest(param) {
    // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      this.serverlist.fileList.push(param.file)
    },
    submitUpload() {
      var upData = new FormData()
      this.$refs.supload.submit()
      if (this.serverlist.fileList.length>1){
        this.$message({
          type: 'warning',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          message: '选择文件数量大于一，请删除多余选择'
        });
        return false
      }
      this.serverlist.fileList.forEach(function (file) {
        const size = file.size / 1024 <= 500
        if (!size) {  //不清楚为什么不能直接使用this.$message，可能因为在forEach里面吧
          upData.append('error','文件大小不能超过500kb')
          return false
        }
        upData.append('file', file, file.name)
      })
      if (upData.get("error")){
        this.$message({
          type: 'error',
          message: upData.get("error")
        });
        return false
      }
      // console.log(upData.get("file"))
      if (!upData.get("file")){
        this.$message({
          type: 'warning',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          message: '未选择文件,请选择文件后在更新'
        });
        return false
      }
      upData.append('cluster', this.value);
      this.serverlist.isServerlistLoading = true
      //执行后台函数
      UpdateServerList(upData)
        .then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.serverlist.isServerlistLoading=false
          this.serverlist.dialogServerlistVisible=false
          this.serverlist.fileList=[]
          this.$refs.supload.clearFiles()
      }, response => {
        this.serverlist.isServerlistLoading=false
        this.serverlist.dialogServerlistVisible=false
        this.serverlist.fileList=[]
        this.$refs.supload.clearFiles()
        console.log(response);
      });
      // this.$refs.upload.submit();
    },

    //update file clientlist
    clientListHttpRequest(param) {
    // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      this.clientlist.fileList.push(param.file)
    },
    clientSubmitUpload() {
      var upData = new FormData()
      this.$refs.cupload.submit()
      this.clientlist.fileList.forEach(function (file) {
        const size = file.size / 1024 <= 500
        if (!size) {  //不清楚为什么不能直接使用this.$message，可能因为在forEach里面吧,所以在底下提示
          upData.append('error','文件大小不能超过500kb')
          return false
        }
        upData.append('file', file, file.name)
      })
      if (upData.get("error")){
        this.$message({
          type: 'error',
          message: upData.get("error")
        });
        return false
      }
      if (!upData.get("file")){
        this.$message({
          type: 'warning',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          message: '未选择文件,请选择文件后在更新'
        });
        return false
      }
      upData.append('cluster', this.value);
      upData.append('version', this.clientlist.clientversion);
      this.clientlist.isLoading = true
      //执行后台函数
      UpdateClientList(upData)
        .then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.clientlist.isLoading=false
          this.$refs.cupload.clearFiles()
          this.clientlist.fileList=[]
      }, response => {
        this.clientlist.isLoading=false
        this.clientlist.fileList=[]
        this.$refs.cupload.clearFiles()
        console.log(response);
      });
      // this.$refs.upload.submit();
    },

    //gmtool
    clearDeadNumber(){
      this.gmTool.isClearLoading = true;
      clearDeadNumber(this.gmTool.pk)
      .then(response => {
        if (response.res == 500){
          this.$message({
            type: 'error',
            message: response.msg
          });
        }else{
          this.$message({
            type: 'success',
            message: '清除已经开始，请等待'
          });
        }
        this.gmTool.isClearLoading = false;
        console.log(response);
      }, response => {
        this.gmTool.isClearLoading = false;
        console.log(response);
      })
    },
    getAutoClearDeadNumber(){
      this.gmTool.isgetAutoLoading = true;
      getAutoClearDeadNumber(this.gmTool.pk)
      .then(response => {
        if (response.res == 500){
          this.$message({
            type: 'error',
            message: response.msg
          });
        }else{
          this.gmTool.auto_is_open = response.msg
          this.gmTool.auto_is_open_context = (this.gmTool.auto_is_open == 1) ? "开启的" : "关闭的"
        }
        this.gmTool.isgetAutoLoading = false;
        console.log(response);
      }, response => {
        this.gmTool.isgetAutoLoading = false;
        console.log(response);
      })
    },
    switchAutoClearDeadNumber(){
      this.gmTool.isswitchAutoLoading = true;
      switchAutoClearDeadNumber(this.gmTool.pk,{"is_open": this.gmTool.auto_is_open})
      .then(response => {
        if (response.res == 500){
          this.$message({
            type: 'error',
            message: response.msg
          });
        }else{
          this.$message({
            type: 'success',
            message: '更新成功'
          });
          this.gmTool.auto_is_open = (this.gmTool.auto_is_open == 1) ? 0 : 1
          this.gmTool.auto_is_open_context = (this.gmTool.auto_is_open == 1) ? "开启的" : "关闭的"
        }
        this.gmTool.isswitchAutoLoading = false;
        console.log(response);
      }, response => {
        this.gmTool.isswitchAutoLoading = false;
        console.log(response);
      })
    },
    gmToolTabClick(tab){
      if(tab.paneName == "autoClearDeadNumber"){
        this.getAutoClearDeadNumber()
      }
    },

    //update notice
    updateNotice(){
      this.notice.isNoticeLoading = true;
      updateNotice({"cluster": this.value,"old_version": this.notice.old_version,"new_version": this.notice.new_version})
      .then(response => {
        if (response.status == 500){
          this.$message({
            type: 'error',
            message: response.msg
          });
        }else{
          this.$message({
            type: 'success',
            message: '更新成功'
          });
        }
        this.notice.isNoticeLoading = false;
        this.notice.dialogNoticeVisible = false;
        console.log(response);
      }, response => {
        this.notice.isNoticeLoading = false;
        this.notice.dialogNoticeVisible = false;
        console.log(response);
      })
    },

    //open/close security group
    ConfirmPortOpen(row){
      this.$prompt('请确认服务器需要'+ (row.port_open=== true ?'关闭':'开启')+'此服务器的aws对外映射端口！ 请输入需要更新的服务器名称确认关闭。 ', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (row.name == value){
            return true
          }else{
            return "world_name不匹配"
          }
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {    
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.Update_security_group(row,instance,done)
          } else {
            this.$message({
            type: 'info',
            message: '已取消更新'
            });
            done();
          }
        }
      })
    },
    Update_security_group(row,instance,done){
      UpdateSecurityGroup(row.id)
      .then(response => {
          if (response.status == 500){
            this.$message({
              type: 'error',
              message: response.msg
            });
          }else{
            this.$set(row,"port_open",!row.port_open)
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }
          instance.confirmButtonLoading = false;
          done();
          console.log(response);
      }, response => {
          console.log(response);
      }) 
    },
    //batch security group
    beforeSecurityGroup(){
      if(this.batchOperate.multipleName==""){
        this.$message({
          message: '请先选择需要操作的world',
          type: 'warning'
        });
      }else{
        this.batchSecurityGroup.dialogVisible = true;
      }
    },
    batchUpdateSecurityGroup(){
      this.batchResult.activeName = "securityGroup"
      batchUpdateSecurityGroup({"world_list": this.batchOperate.multipleId, "cluster": this.value})
      .then(response => {
          this.$notify({
            title: '更新开始', 
            // type: 'success',
            message: this.$createElement('i', { style: 'color: teal'}, '操作已经开始,请前往Result界面查看结果')
          });
          this.batchSecurityGroup.dialogVisible = false;
      }, response => {
          console.log(response);
      }) 
    },

    //get reallog data from logfile
    getData(){
      GetRealLog(this.realLog.path)
        .then(response => {
            this.realLog.dialog_data = response
            this.$nextTick(() => {   //滚动条最下函数
              let msg = document.getElementById('scroll') // 获取对象
              msg.scrollTop = msg.scrollHeight // 滚动高度
            })
        }, response => {
            console.log(response);
        })   
    },
    //destry RealLog dialog
    destry() { 
      this.realLog.dialogRealLogVisible = false,
      DeleteRealLog({ path: this.realLog.path })
      this.realLog.dialog_data="loading..."
      clearInterval(this.realLog.timer)
      this.getWorld()
    },
    dialogDestry(str){
      this.$message({
        type: 'info',
        message: '已取消'+str
      });
    },
    
    //table data sort
    sortsplit(value){
      return value.split("firestrike-world")[1]
    },
    sortByName(obj1, obj2) {
      let val1 = obj1.sortsplit
      let val2 = obj2.sortsplit
      console.log(val1,val2)
      return val1 - val2
    },
      
    //world select value change
    handleSelectionChange(val) {
      this.batchOperate.multipleId = val.map(function (item, idnex) {
          return item.id
      })
      this.batchOperate.multipleName = val.map(function (item, idnex) {
          return item.name
      })
      this.batchOperate.multipleName = this.batchOperate.multipleName.toString()
    },

    // clearData
    clearData(){
      this.createForm.world_id=""
      this.createForm.image_tag=""
      this.createForm.prod_name="Planet #"
      this.createForm.copymap=""
      this.updateForm.image_tag=""
    },

    //pagination
    paginationWorldCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagination.world.currentPage = val
    },
    paginationOperateCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagination.operatehistory.currentPage = val
    },
    //分页时要设置选择会有一个行号，这里需要一个RowKey的属性
    getRowKeys(row) {
      return row.id; 
    },
  }
}
</script>
<style scoped>
.move {
  padding-left: 30px;
  padding-top: 30px;
}
.comment{
    white-space:pre-wrap;
} 
.dialogStyle{
  height: 400px;
  overflow-y:scroll;
  background:black;
  font-size: 16px;
  color: aliceblue;
}
.healthy_stsyle{
  font-size: 20px;
  /* color:blue; */
  position: relative;
  top:3px;
  left: 10px;
}
</style>>
