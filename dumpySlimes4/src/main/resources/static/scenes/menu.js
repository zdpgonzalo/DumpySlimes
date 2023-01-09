class Menu extends Phaser.Scene
{
    url = '192.168.1.87';

    constructor()
    {
        super({key: 'Menu', active: false});

    }

    init()
    {
        this.CONFIG = this.sys.game.CONFIG;
        this.accounts = undefined;
        this.user = undefined;
        this.music = this.sound.add('menu');
        this.music.loop = true;
        this.game.sound.stopAll();
        this.music.play();
    }

    preload()
    {

    }

    create()
    {
        // Logo del juego
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY, 'fondoMenu').setScale(1);
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY * 0.4, 'logo').setScale(0.3);
        // Botones
        this.offline = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.1, 'newGameButton').setInteractive().setScale(0.5);
        this.online = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.3, 'chatButton').setInteractive().setScale(0.5);
        // Controles jugador 1
        this.controles1 = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY * 1.85,
            'click',
            'WASD para moverse y Espacio para powerups',
            48
        ).setOrigin(0.5);

        this.loginText = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY * 1.5,
            'click',
            '',
            48
        ).setOrigin(0.5);

        let that = this;
        $(window).bind('beforeunload', function(){
            that.loadAccounts(function (accounts) {
                that.accounts = accounts;
                that.accounts[that.user.id - 1].active = false;
                that.updateAccount(that.accounts[that.user.id - 1]);
            });
        });
        this.offline.on('pointerdown', function () {
            this.setTexture('newGameButtonDark');
            that.goPlay();
        });
        this.online.on('pointerdown', function () {
            that.offline.visible = false;
            that.online.visible = false;
            that.controles1.visible = false;
            let user = that.add.dom(that.CONFIG.centerX * 0.5, that.CONFIG.centerY).createFromCache('login');
            user.addListener('click');
            user.on('click', function (event) {

                if(event.target.name === 'loginButton')
                {
                    let inputUsername = this.getChildByName('username');
                    let inputPassword = this.getChildByName('password');
        
                    if(inputUsername.value !== '' && inputPassword.value !== '')
                    {
                        let exist = false;
                        let index = undefined;

                        that.loadAccounts(function (accounts) {
                            that.accounts = accounts;

                            if(that.accounts != undefined)
                            {
                                for (let i = 0; i < that.accounts.length; i++) {
                                    if(that.accounts[i].name == inputUsername.value)
                                    {
                                        exist = true;
                                        index = i;
                                    }
                                }
                            }

                            if(!exist)
                            {
                                let account = {
                                    name: inputUsername.value,
                                    password: inputPassword.value,
                                    active: true
                                }
                        
                                that.createAccount(account, function (account) {
                                    that.user = account;
                                    that.scene.start('Chat', {user: that.user});
                                });
                            }
                            else
                            {
                                if(that.accounts[index].active == true)
                                {
                                    that.loginText.setText('Cuenta ocupada');
                                }
                                else
                                {
                                    if(that.accounts[index].password == inputPassword.value)
                                    {
                                        that.accounts[index].active = true;
                                        that.updateAccount(that.accounts[index]);
                                        that.user = that.accounts[index];

                                        that.scene.start('Chat', {user: that.user});
                                    }
                                    else
                                    {
                                        that.loginText.setText('Contraseña incorrecta');
                                    }
                                }
                            }
                        });
                    }
                    else
                    {
                        if(inputUsername.value === '' && inputPassword.value === '')
                        {
                            that.loginText.setText('Falta el nombre y la contraseña');
                        }
                        else
                        {
                            if(inputUsername.value === '')
                            {
                                that.loginText.setText('Falta el nombre');
                            }
                            else
                            {
                                that.loginText.setText('Falta la contraseña');
                            }
                        }
                    }
                }
            });
        });
    }

    goPlay()
    {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.game.sound.stopAll();
            this.scene.start('Play', {playerOneScore: 0, playerTwoScore: 0});// Empieza la partida con las puntuaciones a 0
        })
    }

    loadAccounts(callback) {
        $.ajax({
            url: 'http://' + window.location.host + '/accounts'
        }).done(function (accounts) {
            console.log('Accounts loaded: ' + JSON.stringify(accounts));
            callback(accounts);
        })
    }

    createAccount(account, callback) {
        $.ajax({
            method: "POST",
            url: 'http://' + window.location.host + '/accounts',
            data: JSON.stringify(account),
            processData: false,
            headers: {
                "Content-Type": "application/json"
            }
        }).done(function (account) {
            console.log("Account created: " + JSON.stringify(account));
            callback(account);
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
}
