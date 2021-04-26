<?php

namespace frontend\modules\priroda_dr\components;

use Yii;

class Breadcrumbs {
	public static function get_breadcrumbs($level, $title = '', $crumb = '') {
        if ($title === 'zagorodniy-kompleks') {
            $title = 'Загородный комплекс';
        } elseif ($title ===  'kottedzh') {
            $title = 'Коттедж';
        } elseif ($title ===  'baza-otdyha') {
            $title = 'База отдыха';
        } elseif ($title ===  'shater') {
            $title = 'В шатре';
        } elseif ($title ===  'veranda-besedka') {
            $title = 'На террасе/веранде';
        } elseif ($title ===  '') {
            $title = 'Все площадки';
        } elseif ($title ===  'leto') {
            $title = 'Лето';
        } elseif ($title ===  'zima') {
            $title = 'Зима';
        } elseif ($title ===  'vesna') {
            $title = 'Весна';
        } elseif ($title ===  'osen') {
            $title = 'Осень';
        }


        $crumbUrl = $crumb;

        if (stripos($crumb, 'zagorodniy-kompleks')) {
            $crumb = 'Загородный комплекс';
        } elseif (stripos($crumb, 'kottedzh')) {
            $crumb = 'Коттедж';
        } elseif (stripos($crumb, 'baza-otdyha')) {
            $crumb = 'База отдыха';
        } elseif (stripos($crumb, 'shater')) {
            $crumb = 'В шатре';
        } elseif (stripos($crumb, 'veranda-besedka')) {
            $crumb = 'На террасе/веранде';
        }elseif (stripos($crumb, 'leto')) {
            $crumb = 'Лето';
        }elseif (stripos($crumb, 'zima')) {
            $crumb = 'Зима';
        }elseif (stripos($crumb, 'vesna')) {
            $crumb = 'Весна';
        }elseif (stripos($crumb, 'osen')) {
            $crumb = 'Осень';
        } else {
            $crumb = 'Все площадки';
        }
        
		switch ($level) {
			case 1:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
                    '' => $title,
				];
				break;
			case 2:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
					'/blog/' => 'Наши статьи',
				];
				break;
			case 3:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
                    // '/katalog-ploshchadok/' => $crumb,
                    $crumbUrl => $crumb,
					// '' => $crumb,
					'' => $title,
				];
				break;
			case 4:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
					'/blog/' => 'Наши статьи',
					'' => $title,
				];
				break;
			case 5:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
					'/kontakty/' => 'Контакты',
				];
				break;
			case 6:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
					'/privacy/' => 'Политика конфиденциальности',
				];
				break;
		}
		return $breadcrumbs;
	}
}