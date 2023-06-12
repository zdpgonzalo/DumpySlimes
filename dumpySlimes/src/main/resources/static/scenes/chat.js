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
	            $('#chat').val($('#chat').val() + messages[i].text + "\n");
	        }
	        $('#chat').scrollTop = $('#chat').scrollHeight;
    	});
        this.loadAccounts(function (accounts, result) {
			if (result){
				$('#users').val('');
	            $('#users').val($('#users').val() + "ACTIVE ACCOUNTS" + "\n" + "---------------" + "\n");
	            for (let i = 0; i < accounts.length; i++) {
					if(accounts[i].active == true)
					{
						$('#users').val($('#users').val() + accounts[i].name + "\n");
					}
	            }
	            $('#users').scrollTop = $('#users').scrollHeight;
			} else {
				$('#users').val('');
				$('#users').val($('#users').val() + "SERVER DISCONECTED" + "\n");
	            $('#users').scrollTop = $('#users').scrollHeight;
			}
        });
    }

    loadAccounts(callback) {
		var urls = [window.location.href + 'accounts'];
        $.each(urls, function(i,u){
	        $.ajax(u,{
	            //url: 'http://' + url + '/accounts'
	        }).done(function (accounts) {
	            console.log('Accounts loaded: ' + JSON.stringify(accounts));
	            callback(accounts, true);
	        }).fail(function () {
                console.log('Servidor desconectado')
                callback(null, false);
            })
        })
    }

    updateAccount(account) {
		var urls = [window.location.href + 'accounts/' + account.id];
        $.each(urls, function(i,u){
	        $.ajax(u,{
	            method: 'PUT',
	            //url: 'http://' + url + '/accounts/' + account.id,
	            data: JSON.stringify(account),
	            processData: false,
	            headers: {
	                "Content-Type": "application/json"
	            }
	        }).done(function (account) {
	            console.log("Updated item: " + JSON.stringify(account))
	        })
        })
    }

    loadMessages(callback) {
		var urls = [window.location.href + 'messages'];
        $.each(urls, function(i,u){
	        $.ajax(u,{
	            //url: 'http://' + url + '/messages'
	        }).done(function (messages) {
	            console.log('Messages loaded: ' + JSON.stringify(messages));
	            callback(messages);
	        })
        })
    }

    createMessage(message) {
		var urls = [window.location.href + 'messages'];
        $.each(urls, function(i,u){
	        $.ajax(u,{
	            method: "POST",
	            //url: 'http://' + url + '/messages',
	            data: JSON.stringify(message),
	            processData: false,
	            headers: {
	                "Content-Type": "application/json"
	            }
	        }).done(function (message) {
	            console.log("Message created: " + JSON.stringify(message));
	        })
        })
    }
}