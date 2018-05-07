$(function () {
    let todo = $('.todo-list');
    let comp = $('.comp-list');
    let indexcounter = 0;
    let todolist = [];
    let storage = localStorage.todo;

    if (storage){
        JSON.parse(storage).forEach( evt => {
            taskAdd(evt.val);
            indexcounter++;
            console.log('indexcounter:'+indexcounter);
        });
    }

    $('.add-btn').on('click', () => {
        //入力されたタスクの追加。
        const addTask = $('.new-task').val();
        if (!addTask){
            $('#new-task').addClass('form-control-danger');
            $('#new-task').removeClass('comp-btn');
            return;
        }//↑空白処理
        const escape = htmlspecialchars(addTask);

        taskAdd(escape);
        $('.new-task').val('');
        indexcounter++;
        storages();   
    });

    // =======================================
    // taskAdd(task) Todo追加
    // =======================================
    function taskAdd(task){
        const addedTaskEl = $('<li class="list-item">').attr('data-todo', indexcounter);
        //削除・コンプ ボタンの追加
        addedTaskEl.html(`
            <input type="checkbox" id="check">
            <label for="check" id="text">${task}</label>
            <input type="text">
            <div class="btn-group btn-group-lg" role="group" aria-label="...">
                <button class="comp-btn">完了</button>
                <button class="del-btn">削除</button>
            </div>
        `
        );

        // console.log(task);

          // 削除ボタン 機能の追加
          $(addedTaskEl).on('click', '.del-btn', (evt) =>{
            $(evt.currentTarget).parent().parent().remove();

        });

        // コンプボタン 機能の追加
        $(addedTaskEl).on('click', '.comp-btn', (evt) =>{
            comp.append($(evt.currentTarget).parent().parent());
            //addedTaskE.find('.comp-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.comp-btn');
            changeBtn.text('戻す');
            changeBtn.addClass('back-btn');
            changeBtn.removeClass('comp-btn');
        });

        // バックボタン 機能の追加
        $(addedTaskEl).on('click', '.back-btn', (evt) =>{
            todo.append($(evt.currentTarget).parent().parent());
            //addedTaskE.find('.back-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.back-btn');

            changeBtn.text('完了');
            changeBtn.addClass('comp-btn');
            changeBtn.removeClass('back-btn');
        })

         //タスクの追加
        todo.append(addedTaskEl);
    };

    // =======================================
    // storages() localStorage追加
    // =======================================
    function storages(){
        let list = [];

        todo.find("li").each(function(){
            let item = $(this);
            console.log(this);

            list.push({
                val:item.find('#text').text()

            });
        });
        localStorage["todo"] = JSON.stringify(list);
    }
});

function htmlspecialchars(str) {
	return (str + '').replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}