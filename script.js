const roleConfig = {
  admin: {
    title: '平台管理员',
    sidebar: ['系统监控','成员管理','角色分配'],
    main: '查看平台健康信息、全局统计和用户管理。',
    extra: '系统日志\n安全审计'
  },
  pm: {
    title: '项目经理',
    sidebar: ['项目总览','任务燃尽','资源面板'],
    main: '管理项目进度、成员和预算。',
    extra: '提醒中心'
  },
  architect: {
    title: '系统架构师',
    sidebar: ['项目列表','架构编辑','版本比对'],
    main: '创建和维护系统架构模型。',
    extra: 'SSP 导出'
  },
  sim: {
    title: '仿真工程师',
    sidebar: ['仿真任务','流程编辑','结果面板'],
    main: '配置并运行仿真任务，查看结果。',
    extra: '仿真助手'
  },
  model: {
    title: '建模工程师',
    sidebar: ['建模任务','模型库','上传工具'],
    main: '完成模型开发与提交。',
    extra: '快速建模模板'
  }
};

function login() {
  const role = document.getElementById('roleSelect').value;
  showConsole(role);
}

function showConsole(role) {
  const cfg = roleConfig[role];
  document.getElementById('login').classList.add('hidden');
  document.getElementById('console').classList.remove('hidden');
  document.getElementById('roleTitle').textContent = cfg.title + ' 控制台';
  document.getElementById('sidebar').innerHTML = '<ul>' + cfg.sidebar.map(i=>'<li>'+i+'</li>').join('') + '</ul>';
  document.getElementById('main').textContent = cfg.main;
  document.getElementById('extra').textContent = cfg.extra;
}
