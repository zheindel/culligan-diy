//This javascript implements some interactive features for sub navs
//Depends on jQuery.

//table lists
$(function(){
	//$('.table-list').each(function(){
	//	initTableList($(this));
	//});
});
var n = 0;
function initTableList($tableList){
	//Grab the localized "next" text

	var nextText = $tableList.data('more-localized') || "More";
	var backText = $tableList.data('back-localized') || "Back";
	//Let's create a temporary array to store our overflow items in.
	var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	$tableList.data('lastKnownWidth', screenWidth);
	processTableList($tableList);

	
	//Add navigation navigtaion
	if($tableList.find('.subnav_navigation').length==0)
	{
		$('<ul class="subnav_navigation">'+
			'<li class="subnav_item table-list-back">' +
			'<span class="colorbar"></span>'+
			'<a href="#" class=""><span class="ion-arrow-left-b"></span> '+ backText + '</a>'+
			'<li class="subnav_item table-list-more">' +
			'<span class="colorbar"></span>'+
			'<a href="#" class="">'+nextText+' <span class="ion-arrow-right-b"></span></a>'+
			'</li></ul>').appendTo($tableList);
		$tableList.find('.table-list-more').click(function(){
			nextTableList($tableList);
		});
		$tableList.find('.table-list-back').click(function(){
			prevTableList($tableList);
		});
	}
	//Add first and last
	$tableList.find('.column').first().addClass('first');
	$tableList.find('.column').last().addClass('last');

	//add position to everything
	if($tableList.find('.current').length==0){
		$tableList.find('.column').first().addClass('table-list-current-page');
	} else {
		var foundYou = false;
		$tableList.find('.column').each(function(){
			if($(this).find('.current').length>0){
				$(this).addClass('table-list-current-page');
				$(this).removeClass('table-list-right');
				foundYou = true;
			} else {
				if(foundYou)
					$(this).addClass('table-list-right');
				else
					$(this).addClass('table-list-left').removeClass('table-list-right');
			}
		});
	}
	if($tableList.find('.table-list-current-page').is('.last'))
		$tableList.find('.table-list-more').fadeOut(0);
	if($tableList.find('.table-list-current-page').is('.first'))
		$tableList.find('.table-list-back').fadeOut(0);
}

function processTableList ($this) {
	var $tempItems;
	var $listItems = $this.find('li');
	var $tableList = $this;
	//reset parent element
	if(!($tableList.is('.table-list'))){
		$tableList = $tableList.closest('.table-list');
	}
	var tableListHeight = $tableList.height();
	
	if(getTallestItemHeight($listItems) > tableListHeight)
	{
		$tableList.addClass('table-list-has-more');//This makes the table-list indent from the right making space for the more link box.;
		//Remove items from the list until it fits the height defined in CSS
		for (var i=0; i<$listItems.length; i++)
		{
			//Take the last element out and keep trying
			if(getTallestItemHeight($listItems) > tableListHeight)
			{
				$tempItems = $this.find('li').last().detach().add($tempItems);
			}
		}
		//Create another tablelist for the new items.
		var $newTableList = $tableList.clone().find('.column').first();
		$newTableList.find('ul').empty().append($tempItems);
		$tableList.append($newTableList);
		
		processTableList($newTableList); //recurse.
	}
}

function checkTableLists(){
	var check = true;
	$('.table-list').each(function(){
		if (getTallestItemHeight($(this).find('li')) > $(this).height())
			check = false;
	});
	return check;
}

function resetTableLists(){
	$('.table-list').each(function(){
		$(this).removeClass('table-list-transitions-on table-list-has-more');
		if($(this).find('.column').length > 0)
		{
			$(this).find('.column li').appendTo($(this).find('.column ul').first().empty()); //Put everything into one.
			// clean up
			$(this).find('.subnav_navigation, .column:not(":first-child")').remove(); 
			$(this).find('.first, .last, .table-list-current-page, .table-list-right, .table-list-left').removeClass('first last table-list-current-page table-list-right table-list-left');
		}
	});
}

function getTallestItemHeight($elements){
	var tallestHeight=0;
	$elements.each(function(){
		if($(this).height()>tallestHeight)
			tallestHeight = $(this).height();
	});
	return tallestHeight;
}

function nextTableList($this){
	$this.addClass('table-list-transitions-on');

	$this.find('.table-list-back').fadeIn();
	if(!($this.find('.table-list-current-page').is('.last')))
		$this.find('.table-list-current-page').removeClass('table-list-current-page').addClass('table-list-left').next('.column').addClass('table-list-current-page').removeClass('table-list-right');

	if($this.find('.table-list-current-page').is('.last'))
		$this.find('.table-list-more').fadeOut();
	return $this;
}

function prevTableList($this){
	$this.addClass('table-list-transitions-on');
	$this.find('.table-list-more').fadeIn();
	if(!($this.find('.table-list-current-page').is('.first')))
		$this.find('.table-list-current-page').removeClass('table-list-current-page').addClass('table-list-right').prev('.column').addClass('table-list-current-page').removeClass('table-list-left');

	if($this.find('.table-list-current-page').is('.first'))
		$this.find('.table-list-back').fadeOut();
	return $this;
}