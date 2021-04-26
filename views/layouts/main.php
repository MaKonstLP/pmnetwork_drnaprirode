<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use frontend\modules\priroda_dr\assets\AppAsset;
use common\models\Subdomen;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <link rel="icon" type="image/png" href="/dist/images/icon_dr_priroda.ico">
    <title><?php echo $this->title ?></title>
    <?php $this->head() ?>
    <?php if (!empty($this->params['desc'])) echo "<meta name='description' content='".$this->params['desc']."'>";?>
    <?php if (!empty($this->params['kw'])) echo "<meta name='keywords' content='".$this->params['kw']."'>";?>
    <?php if (!empty($this->params['canonical'])) echo "<link rel='canonical' href='".$this->params['canonical']."'>";?>
    <?= Html::csrfMetaTags() ?>
    <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WTV3BGB');</script>
<!-- End Google Tag Manager -->
</head>
<body>

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WTV3BGB"
height="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<?php $this->beginBody() ?>

    <div class="main_wrap">
        
        <header>
            <div class="header_wrap_fixed">

                <div class="header_menu">

                    <a href="/" class="header_logo">

                        <div class="header_logo_img"></div>
                        <div class="header_logo_text">
                            <p>
                                <span>Дни рождения</span><br>
                                <span>на природе</span>
                            </p>
                        </div>
                        
                    </a>

                    <div class="header_city_select">

                        <span>Ваш город: </span>
                        <span><?=Yii::$app->params['subdomen_name']?></span>
                        <!-- <span>Санкт-Петербург</span> -->
                        <!-- <span>Уфа</span> -->
                    </div>

                    <div class="city_select_search_wrapper dropForm_wrapper _hide">

                        <div class='back_to_header_menu'></div>

                        <h4>Выберите город</h4>

                        <div class="city_select_list">

                            <?php
                                $subdomen_list = Subdomen::find()
                                    ->where(['active' => 1])
                                    ->orderBy(['name' => SORT_ASC])
                                    ->all();

                                function createCityNameLine($city){
                                    if($city->alias){
                                        $newLine = "<div class='city_checkbox' data-action='city_checkbox' data-href='https://$city->alias.drnaprirode.ru/'>
                                                    <input type='checkbox' name='city' class='personalData' checked='' data-required>
                                                    <p class='checkbox_pseudo'>$city->name</p>
                                                    </div>";
                                    }
                                    else{
                                        $newLine = "<div class='city_checkbox' data-action='city_checkbox' data-href='https://drnaprirode.ru/'>
                                                    <input type='checkbox' name='city' class='personalData' checked='' data-required>
                                                    <p class='checkbox_pseudo'>$city->name</p>
                                                    </div>";
                                    }

                                    return $newLine;
                                }

                                function createLetterBlock($letter){
                                    $newBlock = "<div class='city_select_letter_block' data-first-letter=$letter>";
                                    return $newBlock;
                                }

                                function createCityList($subdomen_list){
                                    $citiesListResult = "";
                                    $currentLetterBlock = "";

                                    foreach ($subdomen_list as $key => $subdomen){
                                        $currentFirstLetter = substr($subdomen->name, 0, 1);
                                        if ($currentFirstLetter !== $currentLetterBlock){
                                            $currentLetterBlock = $currentFirstLetter;
                                            $citiesListResult .= "</div>";
                                            $citiesListResult .= createLetterBlock($currentLetterBlock);
                                            $citiesListResult .= createCityNameLine($subdomen);
                                        } else {
                                            $citiesListResult .= createCityNameLine($subdomen);
                                        }
                                    }
                                        
                                    $citiesListResult .= "</div>";
                                    echo substr($citiesListResult, 6);

                                }

                                createCityList($subdomen_list);
                            ?>

                        </div>

                        <a href="" class="city_select_btn">
                            <span>Выбрать</span>
                        </a>

                    </div>

                    <!-- <a href="tel:+78462458000" class="header_phone">(846) 245-80-00</a> -->
                    <a href="tel:+79252380159" class="header_phone">+7 (925) 238-01-59</a>

                    <div class="btn_wrapper">
                        <div class="btn_banquet">
                            <span>Заказать банкет</span>
                        </div>

                        <div class="btn_call">
                            <span>Заказать звонок</span>
                        </div>

                        <div class="btn_wrapper_row">
                            <div class="header_city_select header_city_select_notdesc">
                                <span>Ваш город: </span>
                                <span><?=Yii::$app->params['subdomen_name']?></span>
                                <!-- <span>Санкт-Петербург</span> -->
                                <!-- <span>Уфа</span> -->
                            </div>

                            <a href="tel:+79252380159" class="header_phone header_phone_notdesc">+7 (925) 238-01-59</a>
                        </div>
                        
                    </div>

                    <div class="dropForm_wrapper banquet_form_wrapper _hide">
                        <?= $this->render('../components/generic/form_banquet.twig') ?>
                    </div>

                    <div class="dropForm_wrapper call_form_wrapper _hide">
                        <?= $this->render('../components/generic/form_call.twig') ?>
                    </div>

                    <div class="header_burger">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div class="message_send _hide">
                        <div class='back_to_header_menu'></div>
                        <p class="message_send_title">Ваша заявка успешно отправлена!</p>
                        <p class="message_send_text">В ближайшее время мы свяжемся с вами для уточнения деталей</p>
                    </div>

                </div>

            </div>

            <div class="header_wrap">
                <div class="wave"></div>

                <div class="header_list_wrapper">
                    <div class="header_list header_list_drop">
                        <a href="/za-gorodom/" class="header_list_dropBtn">За городом</a>

                        
                    </div>

                    <div class="drop_content">
                        <a href="/zagorodniy-kompleks/">Загородный комплекс</a>
                        <a href="/kottedzh/">Коттедж</a>
                        <a href="/baza-otdyha/">База отдыха</a>
                        <!-- <a href="/shater/">Шатёр</a>
                        <a href="/veranda-besedka/">Веранды</a>
                        <a href="/veranda-besedka/">Террасы</a>
                        <a href="#">Беседки</a>
                        <a href="#">Крыша</a> -->
                    </div>

                    <div class="header_list">
                        <a href="/shater/">В шатре</a>
                    </div>

                    <!-- <div class="header_list">
                        <a href="/veranda-besedka/">На веранде</a>
                    </div> -->

                    <div class="header_list">
                        <a href="/veranda-besedka/">На террасе/веранде</a>
                    </div>

                    <!-- <div class="header_list">
                        <a href="/krysha/">На крыше</a>
                    </div>-->

                    <div class="header_list">
                        <a href="/katalog-ploshchadok/">Все площадки</a>
                    </div>

                    <div class="header_list">
                        <a href="https://drnaprirode.ru/blog/">Статьи</a>
                    </div>

                    <div class="header_list">
                        <a href="/kontakty/">Контакты</a>
                    </div>
                </div>

            </div>

            <div class="header_burger_wrapper">
                <div class="header_burger_content">

                    <div class="header_list header_list_drop">
                        <div class="header_list_dropBtn">За городом</div>
                    </div>

                    <div class="drop_content">
                        <a href="/zagorodniy-kompleks/">Загородный комплекс</a>
                        <a href="/kottedzh/">Коттедж</a>
                        <a href="/baza-otdyha/">База отдыха</a>
                        <!-- <a href="/shater/">Шатёр</a>
                        <a href="/veranda-besedka/">Веранды</a>
                        <a href="/veranda-besedka/">Террасы</a>
                        <a href="#">Беседки</a>
                        <a href="#">Крыша</a> -->
                    </div>

                    <div class="header_list">
                        <a href="/shater/">В шатре</a>
                    </div>

                    <div class="header_list">
                        <a href="/veranda-besedka/">На террасе/веранде</a>
                    </div>

                    <!-- <div class="header_list">
                        <a href="/veranda-besedka/">На террасе</a>
                    </div> -->

                    <div class="header_list">
                        <a href="/krysha/">На крыше</a>
                    </div>

                    <div class="header_list">
                        <a href="/katalog-ploshchadok/">Все площадки</a>
                    </div>

                    <div class="header_list">
                        <a href="/blog/">Статьи</a>
                    </div>

                    <div class="header_list">
                        <a href="/kontakty/">Контакты</a>
                    </div>

                </div>
            </div>
        </header>

        <div class="content_wrap">
            <?= $content ?>
        </div>

        <footer>
            <div class="footer_container">
                <div class="footer_wrap">
                    <div class="footer_block_left">
                        <a href="/" class="footer_logo">

                            <div class="footer_logo_img"></div>
                            <div class="footer_logo_text">
                                <p>
                                    <span>Дни рождения</span><br>
                                    <span>на природе</span>
                                </p>
                            </div>

                        </a>
                        <div class="footer_info">
                            <p class="footer_copy">Дни рождения на природе © <?php echo date("Y");?></p>
                            <a href="/privacy-policy/" class="footer_link">Политика конфиденциальности</a>
                        </div>                        
                    </div>

                    <div class="footer_block_right">
                        <a href="tel:+79252380159" class="footer_phone">+7 (925) 238-01-59</a>
                    </div>
                </div>
            </div>
        </footer>

    </div> 
<?php $this->endBody() ?>

</body>
</html>
<?php $this->endPage() ?>
