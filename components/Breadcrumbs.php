<?php

namespace frontend\modules\priroda_dr\components;

use Yii;

class Breadcrumbs {
	public static function get_breadcrumbs($level, $title = '') {
		switch ($level) {
			case 1:
				$breadcrumbs=[
					'/' => 'Дни рождения на природе',
					'/katalog-ploshchadok/' => 'Летом',					
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
					'/katalog-ploshchadok/' => 'Летом',
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
		}
		return $breadcrumbs;
	}
}