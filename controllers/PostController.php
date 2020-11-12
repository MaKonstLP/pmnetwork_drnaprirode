<?php
namespace app\modules\priroda_dr\controllers;

use Yii;
use yii\web\Controller;
use frontend\modules\priroda_dr\components\Breadcrumbs;
use common\models\Seo;

class PostController extends Controller
{

  public function actionIndex(){
    $seo['breadcrumbs'] = Breadcrumbs::get_breadcrumbs(4);

    return $this->render('index.twig', array(
      'seo' => $seo
    ));
  }

}