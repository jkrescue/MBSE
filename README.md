# MBSE Workflow Demo

This project contains a simple front-end prototype for an MBSE workflow designer. The `frontend` directory is a Vite + React application that demonstrates a drag-and-drop canvas using **React Flow**.

## Getting started

```bash
cd frontend
npm install
npm run dev
```

The prototype provides four core nodes (需求管理与同步、功能与架构设计、系统集成和仿真、设计追溯). Click a node to configure its sub‑nodes or mark it active. You can simulate execution using **运行流程** or run from a specific node. Node status (pending/running/completed) is displayed and stored. After finishing your workflow you can click **发布为应用** to store the configuration and open an example application page at `/app`.
