$(function () {
    let todo = $('.todo-list');
    let comp = $('.comp-list');
    let indexcounter = 0;
    let animation_rubber = 'animated rubberBand';
    let animationimg = $('.img');
    let taskStr = [];

    //routesのindex.jsで返したものを表示していく
    $.ajax({
            url: '/firstload',
            type: 'GET'
        })
        .done((data) => {
            data.forEach((val, index) => {
                taskStr[index] = val;
                taskAdd(val.task, val.progress);
                $.ajax({
                    url: '/firstupdate',
                    type: 'PUT',
                    data: {
                        taskID: indexcounter,
                        _id: val._id
                    }
                })
            });
        })

    // とどを動かす処理
    $('#button-addon').on({
        'click': () => {
            $(animationimg).addClass(animation_rubber);
        },
        'webkitTransitionEnd webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend': () => {
            $(animationimg).removeClass(animation_rubber);
        }
    });

    // 入力されたタスクの追加
    inputTask();

    // =======================================
    // taskAdd(task) Todo追加
    // =======================================
    function taskAdd(task, progress) {

        indexcounter++;
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

        // 削除ボタンの追加
        delBtn();

        // 編集ボタン 機能の追加
        $(addedTaskEl).on('click', '.edit-btn', (evt) => {
            editTask(addedTaskEl);
        });


        // コンプボタン 機能の追加
        $(addedTaskEl).on('click', '.comp-btn', (evt) => {
            //addedTaskE.find('.comp-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.comp-btn');

            comp.append($(evt.currentTarget).parent().parent());
            addedTaskEl.addClass('progreses');
            changeBtn.text('戻す');
            changeBtn.addClass('back-btn');
            changeBtn.removeClass('comp-btn');

            $.ajax({
                url: '/updateProgress',
                type: 'PUT',
                data: {
                    progress: true
                }
            })
        });

        // バックボタン 機能の追加
        $(addedTaskEl).on('click', '.back-btn', (evt) => {
            //addedTaskE.find('.back-btn')打つのめんどいから。
            const changeBtn = addedTaskEl.find('.back-btn');

            todo.append($(evt.currentTarget).parent().parent());
            changeBtn.text('完了');
            changeBtn.addClass('comp-btn');
            changeBtn.removeClass('back-btn');
            addedTaskEl.removeClass('progreses');
            $.ajax({
                url: '/updateProgress',
                type: 'PUT',
                data: {
                    progress: false
                }
            })
        });

        //タスクの追加
        if (progress) {
            addedTaskEl.addClass('progreses');
            comp.append(addedTaskEl);
            const changeBtn = addedTaskEl.find('.comp-btn');
            changeBtn.text('戻す');
            changeBtn.addClass('back-btn');
            changeBtn.removeClass('comp-btn');
        } else {
            todo.append(addedTaskEl);
        }



        // 削除ボタン 機能の追加
        function delBtn() {
            $(addedTaskEl).on('click', '.del-btn', (evt) => {
                let listItem = addedTaskEl;
                let label = listItem.find('label');

                $.confirm({
                    text: label.text() + "を削除しますか?",
                    confirmButtonClass: "btn-danger",
                    cancelButtonClass: "btn-secondary",
                    cancelButton: "戻る",
                    confirmButton: "削除",
                    cancel: function () {},
                    confirm: function () {
                        $(evt.currentTarget).parent().parent().remove();
                        $.ajax({
                                url: '/del',
                                type: 'DELETE',
                                data: {
                                    taskID: $(evt.currentTarget).parent().parent().data('todo')
                                },
                            })
                            .done((data) => {
                                console.log(data);
                            })
                            .fail(() => {
                                console.log('err');
                            });
                    }
                });
            });
        }
    };

    // =======================================
    // editTask() todoの変更
    // =======================================
    function editTask(addedTaskEl) {

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

        $.ajax({
            url: '/update',
            type: 'PUT',
            data: {
                taskID: listItem.data('todo'),
                task: label.text(),
                progress: listItem.hasClass('progreses')
            }
        })
    }

    // =======================================
    // inputTask() タスクの追加 
    // =======================================
    function inputTask() {
        $('.add-btn').on('click', () => {
            //入力されたタスクの追加。
            const addTask = $('.new-task').val();

            if (!addTask) {
                return;
            } //↑空白処理 スペースは未対応。
            const escape = htmlspecialchars(addTask);
            taskAdd(escape);

            $.ajax({
                url: '/',
                type: 'POST',
                data: {
                    task: escape,
                    progress: false,
                    taskID: indexcounter
                },
            })
            $('.new-task').val('');
        });
    }

});


function htmlspecialchars(str) {
    return (str + '').replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}