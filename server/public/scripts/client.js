console.log('JS sourced');

$(document).ready( function () {
    console.log('jQ sourced');
    
    $('#addButton').on('click', function () {
        console.log('in addbutton');
        //creates object to be set to DB
        var objectToSend = {
            task: $('#taskIn').val(),
            description: $('#descriptionIn').val(),
            dueDate: $('#dueDateIn').val(),
            completed: 'N'
        }
        console.log(objectToSend);
        
    })
})


