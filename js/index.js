$(function () {
    const todo = $('.todo-list');
    const comp = $('.comp-list');
    let counter = 0;

    $('.add-btn').on('click', () => {
        const addedTaskEl = $('<li><input type="checkbox"><label>');
        addedTaskEl.addClass();

        //入力されたタスクの追加。
        const addTask = $('.new-task').val();
        if (!addTask){
           $('#new-task').addClass('form-control-danger');
           $('#new-task').removeClass('comp-btn');
            return;
        }//↑空白処理
        const escape = htmlspecialchars(addTask);
        counter += 1;

        //削除・コンプ ボタンの追加
        addedTaskEl.html(`
            ${escape} 
            <button class="comp-btn">完了</button>
            <button class="edit-btn">編集</button>
            <button class="del-btn">削除</button>
        `
        );

        // 削除ボタン 機能の追加
        $(addedTaskEl).on('click', '.del-btn', (evt) =>{
            $(evt.currentTarget).parent().remove();
        });

        // コンプボタン 機能の追加
        $(addedTaskEl).on('click', '.comp-btn', (evt) =>{
            comp.append($(evt.currentTarget).parent());
            //addedTaskE.find('.comp-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.comp-btn');
            changeBtn.text('戻す');
            changeBtn.addClass('back-btn');
            changeBtn.removeClass('comp-btn');
        });

        // バックボタン 機能の追加
        $(addedTaskEl).on('click', '.back-btn', (evt) =>{
            todo.append($(evt.currentTarget).parent());
            //addedTaskE.find('.back-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.back-btn');
            changeBtn.text('完了');
            changeBtn.addClass('comp-btn');
            changeBtn.removeClass('back-btn');
        })

        //タスクの追加
        todo.append(addedTaskEl);
        $('.new-task').val('');
    });

});


function htmlspecialchars(str) {
	return (str + '').replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

