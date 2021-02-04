<?php
namespace app\modules\priroda_dr\controllers;

use Yii;
use yii\base\InvalidParamException;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\elastic\RestaurantElastic;
use frontend\modules\priroda_dr\components\Breadcrumbs;
use common\models\elastic\ItemsWidgetElastic;
use common\models\elastic\ItemsFilterElastic;
use frontend\modules\gorko_ny\models\ElasticItems;
use common\models\Seo;

class ItemController extends Controller
{

	public function actionIndex($id)
	{
		$elastic_model = new ElasticItems;
		$item = $elastic_model::get($id);
		$items = new ItemsFilterElastic([], 10, 1, false, 'restaurants', $elastic_model);
		// $items = new ItemsFilterElastic($params_filter, $per_page, $page, false, 'restaurants', $elastic_model);

		$seo = new Seo('item', 1, 0, $item, 'rest');
		$seo = $seo->seo;
        $this->setSeo($seo);

		//$item = ApiItem::getData($item->restaurants->gorko_id);

        $seo['h1'] = $item->restaurant_name;
        $seo['breadcrumbs'] = Breadcrumbs::get_breadcrumbs(3, $seo['h1'], $_SERVER['HTTP_REFERER']);
		$seo['desc'] = $item->restaurant_name;
		$seo['address'] = $item->restaurant_address;

		$other_rooms = $item->rooms;

		//echo '<pre>';
		//print_r($item);
		//exit;

		return $this->render('index.twig', array(
			'items' => $items->items,
			'item' => $item,
			'queue_id' => $id,
			'seo' => $seo,
			'other_rooms' => $other_rooms
		));
	}

	// public function actionIndex()
	// {
	// 	$elastic_model = new ElasticItems;
    //     $items = new ItemsFilterElastic([], 10, 1, false, 'restaurants', $elastic_model);
    //     $mainWidget = $this->renderPartial('//components/generic/profitable_offer.twig', [
    //         'items' => $items->items,
    //         'city_rod' => Yii::$app->params['subdomen_rod'],
    //     ]);

	// 	return $this->render('index.twig', array(
	// 		'items' => $items->items
	// 	));
	// }

	private function setSeo($seo){
        $this->view->title = $seo['title'];
        $this->view->params['desc'] = $seo['description'];
        $this->view->params['kw'] = $seo['keywords'];
    }

}