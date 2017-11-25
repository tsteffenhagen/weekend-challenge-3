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
            completed: 'N'
        }
        console.log(objectToSend);
        addListItem(objectToSend);//sends object to the server
    })//End addButton on click

    $('#viewToDoList').on('click', '.deleteButton', deleteListItem);

    $('#viewToDoList').on('click', '.completeButton', completeListItem);
    
    $('#viewToDoList').on('click', '.lateCompleteButton', completeListItem);

})//End Document on ready



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
    var res = rightNow.toISOString().slice(0,10).replace(/-/g,"-");
    console.log(rightNow + "  " + res);
    

    console.log('in getToDoList');
    $.ajax({
        url: '/todo/',
        method: 'GET',
        success: function (response) {
            console.log('List Items: ', response);
            $('#viewToDoList').html('');
            for (let i = 0; i < response.length; i++) {
                var listItem = response[i];
                var longDate = listItem.due_date;
                var trimmedDate = longDate.substring(0, 10);
                console.log(res, " ", trimmedDate);
                
                if (listItem.completed == 'Y') {
                    var $newListItem = $('<tr><td>' + listItem.task + '</td><td>' + listItem.description + '</td><td>' + trimmedDate + '</td><td>' + listItem.completed + '</td></tr>');
                    var $deleteListItemButton = $('<td><button class = "deleteButton">Delete</button></td>');
                    var $completeListItemButton = $('<td><button class = "completedButton">Way To Go!!!</button></td>');
                    $deleteListItemButton.data('id', listItem.user_id);
                    $completeListItemButton.data('id', listItem.user_id);
                    $newListItem.append($deleteListItemButton);
                    $newListItem.append($completeListItemButton);
                    $('#viewToDoList').append($newListItem)
                    $('.completedButton').parent().parent().css("background-color", "green");
                } else if (res >= trimmedDate) {
                    var $newListItem = $('<tr><td>' + listItem.task + '</td><td>' + listItem.description + '</td><td>' + trimmedDate + '</td><td>' + listItem.completed + '</td></tr>');
                    var $deleteListItemButton = $('<td><button class = "deleteButton">Delete</button></td>');
                    var $completeListItemButton = $('<td><button class = "lateCompleteButton">Complete past due item</button></td>');
                    $deleteListItemButton.data('id', listItem.user_id);
                    $completeListItemButton.data('id', listItem.user_id);
                    $newListItem.append($deleteListItemButton);
                    $newListItem.append($completeListItemButton);
                    $('#viewToDoList').prepend($newListItem)
                    $('.lateCompleteButton').parent().parent().css("background-color", "red");
                } else {
                    var $newListItem = $('<tr><td>' + listItem.task + '</td><td>' + listItem.description + '</td><td>' + trimmedDate + '</td><td>' + listItem.completed + '</td></tr>');
                    var $deleteListItemButton = $('<td><button class = "deleteButton">Delete</button></td>');
                    var $completeListItemButton = $('<td><button class = "completeButton">Item Completed!!!</button></td>');
                    $deleteListItemButton.data('id', listItem.user_id);
                    $completeListItemButton.data('id', listItem.user_id);
                    $newListItem.append($deleteListItemButton);
                    $newListItem.append($completeListItemButton);
                    $('#viewToDoList').prepend($newListItem)
                }
            }
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
    });} else {
        console.log('Item not deleted');        
    }

}//end deleteListItem function

function completeListItem() {
    console.log($(this).parent().data('id'));
    var $listItemIdToRemove = $(this).parent().data('id');

    $.ajax({
        url: '/todo/' + $listItemIdToRemove,
        method: 'PUT',
        success: function (response) {
            getToDoList();
        }
    })
}//end completeListItem
