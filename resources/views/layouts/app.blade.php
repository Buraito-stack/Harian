<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .bg-img {
            background-image: url("https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1794&auto=format&fit=crop");
            min-height: 380px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
        }
        .container {
            position: absolute;
            margin: 20px;
            width: auto;
        }
        .topnav {
            overflow: hidden;
            background-color: #333;
        }
        .topnav a {
            float: left;
            color: #f2f2f2;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
            font-size: 17px;
        }
        .topnav a:hover {
            background-color: #ddd;
            color: black;
        }
    </style>
</head>
<body>
    <div class="bg-img">
        <div class="container">
            <div class="topnav">
                <a href="">Home</a>
                <a href="">News</a>
                <a href="">Contact</a>
                <a href="">About</a>
            </div>
        </div>
    </div>
    <div class="p-8">
        @yield('content')
    </div>
</body>
</html>
