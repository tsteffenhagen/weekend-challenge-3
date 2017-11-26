console.log('JS sourced');

$(document).ready(function () {
    console.log('jQ sourced');
    getToDoList(); //gets pre-existing list items on load

    $('#addButton').on('click', function () {
        console.log('in addbutton');
        //creates object to be sent to DB
        var objectToSend = {
            task: $('#taskIn').val(),
            description: $('#descriptionIn').val(),
            dueDate: $('#dueDateIn').val(),
            completed: 'N',
            taskType: $('#taskType').val()
        }
        console.log(objectToSend);
        addListItem(objectToSend);//sends object to the server
    })//End addButton on click

    $('#viewToDoList').on('click', '.deleteButton', deleteListItem);

    $('#viewToDoList').on('click', '.completeButton', completeListItem);

    $('#viewToDoList').on('click', '.lateCompleteButton', completeListItem);

    $('#viewToDoList').on('click', '.completedButton', completedListItems);

    $('.headerTask').on('click', toggleHeaders);

    $('#statisticsDiv').hide();

    $('#toDoListDiv').hide();

    $('#addShow').on('click', toggleItemAdd);

    $('#listShow').on('click', toggleToDoShow);

    $('#statShow').on('click', toggleStatsShow);
})//End Document on ready

var workTime = 0;
var schoolTime = 0;
var homeTime = 0;
var otherTime = 0;
var totalTime = 0;

function addListItem(newListItem) {
    console.log('in add list item: ', newListItem);

    $.ajax({
        url: '/todo/',
        method: 'POST',
        data: newListItem,
        success: function (data) {
            console.log('got list items, ', data);
            getToDoList();
        }
    })
}//end addListItem function

function getToDoList() {
    var rightNow = new Date()
    var res = rightNow.toISOString().slice(0, 10).replace(/-/g, "-");
    console.log(rightNow + "  " + res);


    console.log('in getToDoList');
    $.ajax({
        url: '/todo/',
        method: 'GET',
        success: function (response) {
            console.log('List Items: ', response);
            $('#viewToDoList').html('');
            $('#completedItemList').html('');
            workTime = 0;
            schoolTime = 0;
            homeTime = 0;
            otherTime = 0;
            for (let i = 0; i < response.length; i++) {
                var listItem = response[i];
                var longDate = listItem.due_date;
                var trimmedDate = longDate.substring(0, 10);
                console.log(res, " ", trimmedDate);
                var $newListItem = $('<tr><td class="headerTask">' + listItem.task + '</td><td class="headerToggle">' + listItem.description + '</td><td>' + trimmedDate + '</td><td>' + listItem.completed + '</td></tr>');
                var $deleteListItemButton = $('<td><button class = "deleteButton">Delete</button></td>');
                if (listItem.completed == 'Y') {
                    var $completeListItemButton = $('<td><button class = "completedButton">Move to completed task table</button></td>');
                    $deleteListItemButton.data('id', listItem.user_id);
                    $completeListItemButton.data('id', listItem.user_id);
                    $newListItem.append($deleteListItemButton);
                    $newListItem.append($completeListItemButton);
                    $('#viewToDoList').append($newListItem)
                    $('.completedButton').parent().parent().css("background-color", "green");
                } else if (res >= trimmedDate) {
                    var $completeListItemButton = $('<td><button class = "lateCompleteButton">Complete past due item</button></td>');
                    $deleteListItemButton.data('id', listItem.user_id);
                    $completeListItemButton.data('id', listItem.user_id);
                    $newListItem.append($deleteListItemButton);
                    $newListItem.append($completeListItemButton);
                    $('#viewToDoList').prepend($newListItem)
                    $('.lateCompleteButton').parent().parent().css("background-color", "red");
                } else {
                    var $completeListItemButton = $('<td><button class = "completeButton">Item Completed!!!</button></td>');
                    $deleteListItemButton.data('id', listItem.user_id);
                    $completeListItemButton.data('id', listItem.user_id);
                    $newListItem.append($deleteListItemButton);
                    $newListItem.append($completeListItemButton);
                    $('#viewToDoList').prepend($newListItem)
                }
            }
            for (let i = 0; i < response.length; i++) {
                var listItem = response[i];
                if (listItem.work_time == NaN) {
                    console.log('need some numbers');
                    
                 }else if (listItem.work_type == 'work') {
                    workTime += parseInt(listItem.work_time);
                    totalTime += parseInt(listItem.work_time);
                } else if (listItem.work_type == 'school') {
                    schoolTime += parseInt(listItem.work_time);
                    totalTime += parseInt(listItem.work_time);
                } else if (listItem.work_type == 'home') {
                    homeTime += parseInt(listItem.work_time);
                    totalTime += parseInt(listItem.work_time);
                } else if (listItem.work_type == 'other') {
                    otherTime += parseInt(listItem.work_time);
                    totalTime += parseInt(listItem.work_time);
                }
            }
            $('#completedTimeBreakdown').html('');
            $('#completedTimeBreakdown').append(`<tr class="timeRow"><td> Work </td><td> ${workTime} </td><td> ${Math.floor((workTime / totalTime) * 100)} </td></tr>`);
            $('#completedTimeBreakdown').append(`<tr class="timeRow"><td> School </td><td> ${schoolTime} </td><td> ${Math.floor((schoolTime / totalTime) * 100)} </td></tr>`);
            $('#completedTimeBreakdown').append(`<tr class="timeRow"><td> Home </td><td> ${homeTime} </td><td> ${Math.floor((homeTime / totalTime) * 100)} </td></tr>`);
            $('#completedTimeBreakdown').append(`<tr class="timeRow"><td> Other </td><td> ${otherTime} </td><td> ${Math.floor((otherTime / totalTime) * 100)} </td></tr>`);
            console.log(workTime);
        }
    })
}//end getToDoList function

function deleteListItem() {
    console.log($(this).parent().data('id'));

    var $listItemIdToRemove = $(this).parent().data('id');
    console.log('The list item ID to be removed is: ', $listItemIdToRemove);
    var r = confirm("Are you sure you want to delete?");
    if (r == true) {
        $.ajax({
            url: '/todo/' + $listItemIdToRemove,
            method: 'DELETE',
            success: function (response) {
                getToDoList();
            }
        });
    } else {
        console.log('Item not deleted');
    }

}//end deleteListItem function

function completeListItem() {
    console.log($(this).parent().data('id'));
    var $listItemIdToRemove = $(this).parent().data('id');
    var completionTime = prompt("How long in minutes did it take to complete your task?", "60");
    console.log(completionTime);

    $.ajax({
        url: '/todo/' + $listItemIdToRemove,
        method: 'PUT',
        data: {
            time: completionTime
        },
        success: function (response) {
            getToDoList();
        }
    })
}//end completeListItem

function completedListItems() {
}

function toggleHeaders() {
    $('.headerToggle').toggle();
}

function toggleItemAdd() {
    console.log('in item add');
    
    $('#addListItem').show();

    $('#statisticsDiv').hide();

    $('#toDoListDiv').hide();
}

function toggleToDoShow() {
    $('#addListItem').hide();
    
    $('#statisticsDiv').hide();

    $('#toDoListDiv').show();
}

function toggleStatsShow() {
    $('#addListItem').hide();
    
    $('#statisticsDiv').show();

    $('#toDoListDiv').hide();
}