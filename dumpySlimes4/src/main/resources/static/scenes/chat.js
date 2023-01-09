class Chat extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Chat', active: false});

    }

    init(user)
    {
        this.CONFIG = this.sys.game.CONFIG;
        this.user = user.user;
    }

    preload()
    {

    }

    create()
    {
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY, 'fondoChat').setScale(1);
        let loginMessage = {
            text: this.user.name + ' has joined',
            sender: this.user
        }
        this.createMessage(loginMessage);
        let that = this;
        $(window).bind('beforeunload', function(){
            that.loadAccounts(function (accounts) {
                let accountsX = accounts;
                accountsX[that.user.id - 1].active = false;
                that.updateAccount(accountsX[that.user.id - 1]);
                let message = {
                    text: that.user.name + ' has left',
                    sender: that.user
                }
                that.createMessage(message);
            });
        });
        let user = this.add.dom(this.CONFIG.centerX * 0.5, this.CONFIG.centerY).createFromCache('chat');
        user.addListener('click');
        user.on('click', function (event) {
            if(event.target.name === 'sendMsg')
            {
                let text = this.getChildByName('message').value;

                let message = {
                    text: that.user.name + ': ' + text,
                    sender: that.user
                }

                that.createMessage(message);

                $('#message').innerHTML = '';
            }
            else
            {
                if(event.target.name === 'leave')
                {
                    that.loadAccounts(function (accounts) {
                        let accountsX = accounts;
                        accountsX[that.user.id - 1].active = false;
                        that.updateAccount(accountsX[that.user.id - 1]);
                        let message = {
                            text: that.user.name + ' has left',
                            sender: that.user
                        }
                        that.createMessage(message);
                        that.scene.start('Menu');
                    });
                }
            }
        });
        this.timedEvent = this.time.addEvent({ delay: 200, callback: this.onEvent, callbackScope: this, loop: true });
    }

    onEvent()
    {
        this.loadMessages(function (messages) {
            $('#chat').val('');
            for (let i = 0; i < messages.length; i++) {
                $('#chat').val($('#chat').val() + "\n" + messages[i].text);
            }
            $('#chat').scrollTop = $('#chat').scrollHeight;
        });
    }

    loadAccounts(callback) {
        $.ajax({
            url: 'http://' + window.location.host + '/accounts'
        }).done(function (accounts) {
            console.log('Accounts loaded: ' + JSON.stringify(accounts));
            callback(accounts);
        })
    }

    updateAccount(account) {
        $.ajax({
            method: 'PUT',
            url: 'http://' + window.location.host + '/accounts/' + account.id,
            data: JSON.stringify(account),
            processData: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (account) {
            console.log("Updated item: " + JSON.stringify(account))
        })
    }

    loadMessages(callback) {
        $.ajax({
            url: 'http://' + window.location.host + '/messages'
        }).done(function (messages) {
            console.log('Messages loaded: ' + JSON.stringify(messages));
            callback(messages);
        })
    }

    createMessage(message) {
        $.ajax({
            method: "POST",
            url: 'http://' + window.location.host + '/messages',
            data: JSON.stringify(message),
            processData: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (message) {
            console.log("Message created: " + JSON.stringify(message));
        })
    }
}