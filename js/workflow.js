export class WorkflowModule {
  constructor() {
    this.workflowCanvas = document.getElementById('workflowCanvas');
  }

  init() {
    this.renderWorkflowPage();
  }

  renderWorkflowPage() {
    this.workflowCanvas.innerHTML = `
      <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">工作流管理</h2>
        <button id="createWorkflow" class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors mb-4">创建工作流</button>
        <table class="w-full border-collapse border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">工作流名称</th>
              <th class="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
              <th class="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
              <th class="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody id="workflowTableBody"></tbody>
        </table>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const createWorkflowButton = document.getElementById('createWorkflow');
    createWorkflowButton.addEventListener('click', () => this.showWorkflowCreation());
  }

  showWorkflowCreation() {
    const workflowName = prompt('请输入工作流名称:');
    if (!workflowName) {
      alert('工作流名称不能为空！');
      return;
    }

    const newWorkflow = {
      name: workflowName,
      status: '草稿',
      createdAt: new Date().toLocaleDateString(),
    };

    this.addWorkflowToTable(newWorkflow);
  }

  addWorkflowToTable(workflow) {
    const workflowTableBody = document.getElementById('workflowTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border border-gray-200 px-4 py-3 text-gray-700">${workflow.name}</td>
      <td class="border border-gray-200 px-4 py-3 text-gray-700">${workflow.status}</td>
      <td class="border border-gray-200 px-4 py-3 text-gray-700">${workflow.createdAt}</td>
      <td class="border border-gray-200 px-4 py-3">
        <button class="bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">编辑</button>
        <button class="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm">删除</button>
      </td>
    `;
    workflowTableBody.appendChild(row);
  }
}
