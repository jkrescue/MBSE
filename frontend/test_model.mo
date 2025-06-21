within MyModels;

model BatteryCell
  "BatteryCell: 电池单元模型，包含 OCV、SOC、内部电阻和自放电机制，适用于 BMS 控制策略开发"

  // ─────────—— 参数区 ——─────────
  parameter Modelica.SIunits.Energy E_nominal = 3600 "标称能量 (J)";
  parameter Modelica.SIunits.Voltage V_nominal = 3.7 "标称电压 (V)";
  parameter Real R_int = 0.05 "内部串联电阻 (Ω)";
  parameter Real selfDischargeRate = 1e-5 "自放电速率 (1/s)";
  parameter Real SOC_start = 0.5 "初始荷电状态 (0–1)";

  // ─────────—— 接口端口 ——─────────
  Modelica.Blocks.Interfaces.RealInput i "电流输入 (A)，正为放电，负为充电";
  Modelica.SIunits.Voltage v_out "电池端口电压输出 (V)";
  Modelica.SIunits.Dimensionless SOC "荷电状态输出 (0–1)";

  // ─────────—— 状态变量 ——─────────
  Real Q(start = SOC_start * E_nominal / V_nominal)
    "当前模型状态电荷 (Coulomb)";
  Real v_OCV "开路电压 (V)，依据 SOC 映射";
  Real i_self "自放电电流 (A)";

equation
  // 电荷与 SOC 的关系
  der(Q) = -i - i_self;

  SOC = Q * V_nominal / E_nominal;

  // 假设开路电压与 SOC 线性关系
  v_OCV = V_nominal * SOC;

  // 考虑内部电阻和输出电压
  v_out = v_OCV - R_int * i;

  // 自放电机制
  i_self = selfDischargeRate * Q;

annotation (
  Documentation(info = "
BatteryCell 模型文档：

参数：
  • E_nominal：电池标称能量（J）；
  • V_nominal：电池标称电压（V）；
  • R_int：内部串联电阻（Ω）；
  • selfDischargeRate：自放电率 (1/s)；
  • SOC_start：初始荷电状态 (0–1)。

接口：
  • i（输入）：电流信号，单位 A；
  • v_out（输出）：电池端口输出电压；
  • SOC（输出）：荷电状态 (0–1)。

特性与用途：
  - 建模了电荷-电压关系：v_out = v_OCV – R_int*i；
  - 支持自放电模拟；
  - 可作为 BMS 控制策略组件接入更高层模型；
  - 可扩展接入 OCV 曲线表、热模型或串并联电池组；
"));
end BatteryCell;
