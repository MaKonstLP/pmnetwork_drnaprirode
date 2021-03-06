<?php

namespace app\modules\priroda_dr\widgets;

use Yii;
use frontend\widgets\PaginationWidget as PaginationWidgetOld;

class PaginationWidget extends PaginationWidgetOld
{

	public $total;
    public $current;

    public function run()
    {
    	$buttons = '<div class="items_pagination">';
    	if($this->total > 1){
    		if($this->total > 5){
    			if($this->current <= 3){
    				for ($i = 1; $i <= 4; ++$i) {
			            $buttons .= $this->renderPageButton($i, '', $i == $this->current ? '_active' : '');           
			        }
			        $buttons .= $this->renderPageButton($this->total, '_last', '');
    			}
    			elseif($this->current >= ($this->total - 2)){
    				$buttons .= $this->renderPageButton(1, '_first', '');
    				for ($i = $this->total - 3; $i <= $this->total; ++$i) {
			            $buttons .= $this->renderPageButton($i, '', $i == $this->current ? '_active' : '');           
			        }			        
    			}
    			else{
    				$buttons .= $this->renderPageButton(1, '_first', ''); 
    				for ($i = $this->current - 1; $i <= $this->current + 1; ++$i) {
			            $buttons .= $this->renderPageButton($i, '', $i == $this->current ? '_active' : '');           
			        }
			        $buttons .= $this->renderPageButton($this->total, '_last', ''); 
    			}
    		}
    		else{
    			for ($i = 1; $i <= $this->total; ++$i) {
					$buttons .= $this->renderPageButton($i, '', $i == $this->current ? '_active' : '');          
		        }
    		}
			$buttons .= '</div>';

			if ($this->total > 1){
				if ($this->current == 1) {
					$buttons .= $this->renderSwitchButton(1, $this->current+1, 'var_1');
				} elseif ($this->current == $this->total) {
					$buttons .= $this->renderSwitchButton($this->current-1, $this->total, 'var_2');
				} else {
					$buttons .= $this->renderSwitchButton($this->current-1, $this->current+1, 'var_3');
				}
    		} else {
    			return '';
			}

    		return $buttons;
    	}
    	else{
    		return '';
    	}
    }

    private function renderPageButton($page, $class, $active)
    {
        return '<div class="items_pagination_item '.$active.' '.$class.'" data-page-id="'.$page.'" data-listing-pagitem></div>';
	}

    private function renderSwitchButton($prevPage, $nextPage, $trigger)
    {
		if ($trigger == 'var_1') {
			$trigger_prev = 'pagination_switсh_disabled';
			$trigger_next = '';
		} elseif ($trigger == 'var_3') {
			$trigger_prev = '';
			$trigger_next = '';
		} else {
			$trigger_prev = '';
			$trigger_next = 'pagination_switсh_disabled';
		}

        return '<div class="pagination_switсh">
					<p class="pagination_switсh_prev '.$trigger_prev.'" data-pagswitch data-pagswitch-prev data-page-id="'.$prevPage.'">Предыдущая</p>
					<p class="pagination_switсh_next '.$trigger_next.'" data-pagswitch data-pagswitch-next data-page-id="'.$nextPage.'">Следующая</p>
				</div>';
	}
}