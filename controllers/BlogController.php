<?php
namespace app\modules\priroda_dr\controllers;

use Yii;
use common\models\blog\BlogPost;
use common\models\blog\BlogTag;
use yii\web\Controller;
use yii\widgets\LinkPager;
use frontend\modules\priroda_dr\components\Breadcrumbs;
use app\modules\priroda_dr\widgets\PaginationWidget;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;
use yii\web\NotFoundHttpException;
// use frontend\widgets\PaginationWidget;
use common\models\Seo;

class BlogController extends Controller
{
	public function actionIndex(){
  		$this->view->params['menu'] = 'blog';
  		if(Yii::$app->params['subdomen_alias'] != ''){
  			throw new \yii\web\NotFoundHttpException();
  		}
	    $query = BlogPost::findWithMedia()->with('blogPostTags')->where(['published' => true]);
	    
		$dataProvider = new ActiveDataProvider([
			'query' => $query,
			'pagination' => [
				'pageSize' => 15,
				'forcePageParam' => false,
				'totalCount' => $query->count()
			],
		]);
		
		$seo = (new Seo('blog', $dataProvider->getPagination()->page + 1))->seo;
		$seo['breadcrumbs'] = Breadcrumbs::get_breadcrumbs(2);
		$this->setSeo($seo);
		
		$topPosts = (clone $query)->where(['featured' => true])->limit(5)->all();

		//echo '<pre>';
		//print_r($dataProvider);
		//exit;

		$listConfig = [
			'dataProvider' => $dataProvider,
			'itemView' => '_list-item.twig',
			'layout' => "{items}\n<div class='pagination_wrapper items_pagination' data-pagination-wrapper>{pager}</div>",
			'pager' => [
				'class' => LinkPager::class,
				'disableCurrentPageButton' => true,
				'nextPageLabel' => 'Следующая →',
				'prevPageLabel' => '← Предыдущая',
				'maxButtonCount' => 4,
				'activePageCssClass' => '_active',
				'pageCssClass' => 'items_pagination_item',
			],

		];
		return $this->render('index.twig', compact('listConfig', 'topPosts', 'seo'));
  	}

  	public function actionPost($alias)
	{
		$this->view->params['menu'] = 'blog';
		if(Yii::$app->params['subdomen_alias'] != ''){
  			throw new \yii\web\NotFoundHttpException();
  		}
		$post = BlogPost::findWithMedia()->with('blogPostTags')->where(['published' => true, 'alias' => $alias])->one();
		if(empty($post)) {
			return new NotFoundHttpException();
		}

		$query = BlogPost::findWithMedia()->with('blogPostTags')->where(['published' => true]);

		$dataProvider = new ActiveDataProvider([
			'query' => $query,
		]);

		$listConfig = [
			'dataProvider' => $dataProvider,
			'itemView' => '_list-item.twig',
			'layout' => "{items}",
			'options' => [
				'tag' => 'div',
				'class' => 'swiper-wrapper',
			],
			'itemOptions' => [
				'tag' => 'div',
				'class' => 'swiper-slide',
			], 
		];

		$seo = ArrayHelper::toArray($post->seoObject);
		$seo['breadcrumbs'] = Breadcrumbs::get_breadcrumbs(4, $post->name);
		$this->setSeo($seo);
		return $this->render('post.twig', compact('post', 'seo', 'listConfig'));
	}

	public function actionPreview($id)
	{
		if(Yii::$app->params['subdomen_alias'] != ''){
  			throw new \yii\web\NotFoundHttpException();
  		}
		$post = BlogPost::findWithMedia()->with('blogPostTags')->where(['published' => true, 'id' => $id])->one();
		if(empty($post)) {
			return new NotFoundHttpException();
		}
		$seo = ArrayHelper::toArray($post->seoObject);
		$this->setSeo($seo);
		return $this->render('post.twig', compact('post'));
	}

  	private function setSeo($seo)
	{
		$this->view->title = $seo['title'];
		$this->view->params['desc'] = $seo['description'];
		$this->view->params['kw'] = $seo['keywords'];
	}

}