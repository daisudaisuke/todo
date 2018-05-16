$(function () {
    let todo = $('.todo-list');
    let comp = $('.comp-list');
    let indexcounter = 0;
    let todolist = [];
    let animation_rubber = 'animated rubberBand';
    let animationimg = $('.img');
    
//routesのindex.jsで返したものを表示していく
    if (storage) {
        let object = JSON.parse(storage).forEach(evt => {
            taskAdd(
                evt.val,
                evt.progress_list
            );
            indexcounter++;
            //console.log('indexcounter:' + indexcounter);
        });
    }

    // とどを動かす処理
    $('#button-addon').on({
        'click':() => {
            $(animationimg).addClass(animation_rubber);
        },
        'webkitTransitionEnd webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend':() =>{
            $(animationimg).removeClass(animation_rubber);
        }
    });


    $('.add-btn').on('click', () => {
        //入力されたタスクの追加。
        const addTask = $('.new-task').val();

        if (!addTask) {
            return;
        } //↑空白処理 スペースは未対応。
        const escape = htmlspecialchars(addTask);

        taskAdd(escape);
        $('.new-task').val('');
        indexcounter++;
        storages();
    });

    // =======================================
    // taskAdd(task) Todo追加
    // =======================================
    function taskAdd(task, progress_list){
        const addedTaskEl = $('<li class="list-item animated flipInX">').attr('data-todo', indexcounter);

        //削除・コンプ ボタンの追加
        addedTaskEl.html(`
            
            <label for="check" id="text" class="col-sm-12 radius">${task}</label>
            <input type="text" class="col-sm-12 edit-task" maxlength="140" style="margin-bottom: 10px;">
            <div class="btn-group" role="group">
                <button class="comp-btn btn btn-primary">完了</button>
                <button class="edit-btn btn btn-warning">編集</button>
                <button class="del-btn btn btn-danger">削除</button>
            </div>
        `);    

        // console.log(task);

        // 削除ボタン 機能の追加
        $(addedTaskEl).on('click', '.del-btn', (evt) => {
            let listItem = addedTaskEl;
            let label = listItem.find('label');
            $.confirm({
                text: label.text() +"を削除しますか?",
                confirmButtonClass: "btn-danger",
                cancelButtonClass: "btn-secondary",
                cancelButton: "戻る",
                confirmButton: "削除",
                cancel: function() {
                },
                confirm: function() {
                    $(evt.currentTarget).parent().parent().remove();
                    storages();
                }
            });
        });

        // コンプボタン 機能の追加
        $(addedTaskEl).on('click', '.comp-btn', (evt) => {
            //addedTaskE.find('.comp-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.comp-btn');

            comp.append($(evt.currentTarget).parent().parent());
            addedTaskEl.addClass('progress_list');
            changeBtn.text('戻す');
            changeBtn.addClass('back-btn');
            changeBtn.removeClass('comp-btn');
            storages();
        });

        // 編集ボタン 機能の追加
        $(addedTaskEl).on('click', '.edit-btn', (evt) => {
            editor(addedTaskEl);
            storages();
        });

        // バックボタン 機能の追加
        $(addedTaskEl).on('click', '.back-btn', (evt) => {
            //addedTaskE.find('.back-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.back-btn');

            todo.append($(evt.currentTarget).parent().parent());
            changeBtn.text('完了');
            changeBtn.addClass('comp-btn');
            changeBtn.removeClass('back-btn');
            addedTaskEl.removeClass('progress_list');
            storages();
        });

        //タスクの追加
        if(progress_list) {
            addedTaskEl.addClass('progress_list');
            comp.append(addedTaskEl);
        }
        else {
            todo.append(addedTaskEl);
        }
    };

    // =======================================
    // storages() localStorage追加
    // =======================================
    function storages() {
        let list = [];

        $('ul').find("li").each(function() {
            let item = $(this);
            //console.log(item.hasClass('progress_list'));
            list.push({
                val: item.find('#text').text(),
                progress_list: item.hasClass('progress_list'),
                timestamp: new Date().getTime()
            });
            console.log(item)
        });
        localStorage["todo"] = JSON.stringify(list);
    }

    // =======================================
    // editer() todoの変更
    // =======================================
    function editor(addedTaskEl) {

        let listItem = addedTaskEl;
        let editInput = listItem.find('input');
        let label = listItem.find('label');
        let containsClass = listItem.hasClass('editMode');

        if (containsClass) {
            label.text(editInput.val());
        } else {
            editInput.val(label.text()); 
        }
        listItem.toggleClass('editMode');
    }

});

function htmlspecialchars(str) {
    return (str + '').replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}