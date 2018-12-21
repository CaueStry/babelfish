<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Babel Fish</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/public/img/favicon.ico" />
    <link rel="stylesheet/less" type="text/css"
        href="/public/less/login.less" />
    <script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script
        src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.7.1/less.min.js"></script>
    <script src="/public/js/login.js"></script>
</head>

<body>
    <?php
        require_once __DIR__ . '/loadtwig.php';
        $template = $twig->load('login.twig');
        echo $template->render();
    ?>
</body>

</html>