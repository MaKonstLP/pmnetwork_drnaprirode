<?php
namespace app\modules\priroda_dr\controllers;

use Yii;
use yii\web\Controller;

class ContactsController extends Controller
{

  public function actionIndex(){

    return $this->render('index.twig', array(
      'year' => date('Y') + 1,
      'city_rod' => Yii::$app->params['subdomen_rod']
    ));
  }

}