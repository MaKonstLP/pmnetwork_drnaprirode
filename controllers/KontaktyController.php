<?php
namespace app\modules\priroda_dr\controllers;

use Yii;
use yii\web\Controller;
use frontend\modules\priroda_dr\components\Breadcrumbs;
use common\models\Seo;

class KontaktyController extends Controller
{

  public function actionIndex(){

  	$seo = new Seo('contacts');
		$seo = $seo->seo;
        $this->setSeo($seo);

	$seo['breadcrumbs'] = Breadcrumbs::get_breadcrumbs(5);

    return $this->render('//contacts/index.twig', array(
      // 'year' => date('Y') + 1,
      'city_dec' => Yii::$app->params['subdomen_dec'],
      'seo' => $seo
    ));

   
  }

  private function setSeo($seo){
        $this->view->title = $seo['title'];
        $this->view->params['desc'] = $seo['description'];
        $this->view->params['kw'] = $seo['keywords'];
    }

}