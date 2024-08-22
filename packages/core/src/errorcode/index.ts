/**
 * 错误码定义
 */
export const enum ErrorCode {

    /**
     * 资源冲突（对象已存在）
     */
    ResourceConflict = 409039000,

    /**
     * 对象不存在（或已被删除）
     */
    ResourceInaccessible = 404039000,

    /**
     * 同步计划不存在
     */
    ManualSyncPlanNotFound = 404015000,

    /**
     * 文档手动同步计划已关闭
     */
    ManualSyncPlanClosed = 404015002,

    /**
     * 同步文件超过最大限制大小/数量
     */
    ManualSyncFileExceedLimit = 400015001,

    /**
     * 文档不存在
     */
    DocNotExists = 404015001,

    /**
     * 无权限操作
     */
    AccessNotAllowed = 403015000,

    /**
     * 同步过程中文档库不存在
     */
    DocLibNotExist = 403002024,

    /**
     * 配额不足
     */
    InsufficientQuota = 403002104,

    /**
     * 配额空间大于管理员可配置的空间
     */
    QuotaGreaterThanAvailable = 403002001,

    /**
     * 缺少所有者权限
     */
    NoOwnerPermission = 403015002,

    /**
     * 用户密级小于源端对象的密级
     */
    InsufficientSecretLevel = 403015003,

    /**
     * 源端对象不能是文档库
     */
    OriginIsLibrary = 403015004,

    /**
     * 源端对象不能是知识库或知识库下的文档
     */
    OriginIsKC = 403015005,

    /**
     * 源端位置不能与目标端位置一样
     */
    OriginSameAsTarget = 403015006,

    /**
     * 源端位置不能是目标位置的上级目录
     */
    OriginIsTargetParentDir = 403015007,

    /**
     * 源端对象不存在
     */
    OriginNotExist = 403015008,

    /**
     * 用户不在适用范围内
     */
    UserOutofScope = 403015009,

    /**
     * 未开启文档流转
     */
    SwitchNotOpen = 403014001,

    /**
     * 用户被冻结
     */
    UserFreezed = 403001171,

    /**
     * 密级不足
     */
    InsufficientCSFLevel = 403001108,

    /**
     * 文件不存在
     */
    DocNotExist = 404001024,

    /**
     * 文件或目录不存在
     */
    DocumentNotExist = 404002006,

    /**
     * 文档域管理服务-管理员未开启文档流转
     */
    DocFlowNotEnabled = 403014001,

    /**
     * 文档域同步服务-管理员未开启文档流转
     */
    DocFlowNoPerm = 403015001,

    /**
     * 文档流转不存在
     */
    DocFlowNotExist = 404014000,

    /**
     * 流转有任务在执行
     */
    DocFlowWithTask = 403014002,

    /**
     * 文档流程名称冲突
     */
    DocFlowNameConfilct = 409014000,

    /**
     * 文档流转对目标位置没有所有者权限
     */
    DocFlowTargetNoPerm = 403014000,

    /**
     * 目标位置不存在
    */
    DocFlowTargetNotExist = 404014001,

    /**
     * 适用范围不存在
     */
    ApplyRangeNotExist = 404014002,

    /**
     * 重复发起流转
     */
    RepetitiveOpration = 403015010,

    /**
     * 文档流转失效
     */
    DocFlowInvalid = 403015011,

    /**
     * 文档流转有任务在执行
     */
    DocFlowInProgress = 409014207,

    /**
     * 无效的审核流程
     */
    InvalidWorkFlow = 400014301,

    /**
     * 没有下载权限
     */
    NoDownloadPerm = 403015012,

    /**
     * 受读取策略限制
     */
    RestrictedByReadPolicy = 403015013,

    /**
     * 无审核权限
     */
    NoPermToAudit = 401001101,

    /**
     * 无文档访问统计权限
     */
    NoPermToDocStatistics = 403039001,

    /**
     * 文件不存在
     */
    FileNotExist = 400000001,

    /**
     * 报表数据源分类已不存在
     */
    DataSourceGroupNotExist = 404055101,

    /**
     * 报表数据源分类名称已存在
     */
    DataSourceGroupNameExist = 409055102,

    /**
     * 报表数据源分类下已存在数据源
     */
    DataSourceGroupNotEmpty = 409055103,

    /**
     * 报表数据源名称已存在
     */
    DataSourceNameExist = 409055112,

    /**
     * 报表数据源已不存在
     */
    DataSourceNotExist = 404055111,

    /**
     * 业务组已不存在
     */
    BizGroupNotExist = 404055121,

    /**
     * 业务组名称已存在
     */
    BizGroupNameExist = 409055122,

    /**
     * 报表已不存在
     */
    DataReportNotExist = 404055131,

    /**
     * 报表名称已存在
     */
    DataReportNameExist = 409055132,

    /**
     * 没有创建文档流转的权限
     */
    DocflowPermRefuse = 403014003,
}