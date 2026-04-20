<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>老年人智能监控平台</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        header {
            background: #333;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .card {
            background: #f9f9f9;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        button {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #218838;
        }
        .data-display {
            margin-top: 20px;
        }
        .data-item {
            margin: 5px 0;
        }
    </style>
</head>
<body>

    <header>
        <h1>老年人智能监控平台</h1>
        <p>及时监控和照护</p>
    </header>

    <div class="container">
        <h2>老年人健康状况监控</h2>
        
        <div class="card">
            <h3>老年人列表</h3>
            <ul id="elderly-list">
                <li>老年人 A - 健康状况: 良好 <button onclick="dispatchDoctor('A')">派出医生</button></li>
                <li>老年人 B - 健康状况: 需要关注 <button onclick="dispatchDoctor('B')">派出医生</button></li>
                <li>老年人 C - 健康状况: 危险 <button onclick="dispatchDoctor('C')">派出医生</button></li>
                <!-- 更多老年人记录 -->
            </ul>
        </div>

        <div class="data-display">
            <h3>健康数据总体分析</h3>
            <div class="data-item">总监测人数: 150</div>
            <div class="data-item">健康状况良好人数: 120</div>
            <div class="data-item">需要关注人数: 20</div>
            <div class="data-item">危险人数: 10</div>
            <div class="data-item">近期救治次数: 5</div>
        </div>
    </div>

    <script>
        function dispatchDoctor(elderlyId) {
            alert('已派出医生至老年人 ' + elderlyId + ' 的位置。');
            // 在这里可以添加与后端交互的逻辑
        }
    </script>
</body>
</html>
