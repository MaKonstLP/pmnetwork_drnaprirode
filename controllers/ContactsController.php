<?php
namespace app\modules\priroda_dr\controllers;

use Yii;
use yii\web\Controller;
use frontend\modules\priroda_dr\components\Breadcrumbs;
use common\models\Seo;

class ContactsController extends Controller
{

  public function actionIndex(){

    $seo = [];
		$seo['breadcrumbs'] = Breadcrumbs::get_breadcrumbs(5);

    return $this->render('index.twig', array(
      // 'year' => date('Y') + 1,
      // 'city_rod' => Yii::$app->params['subdomen_rod'],
      'seo' => $seo
    ));

   
  }

}