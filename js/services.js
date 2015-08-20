angular.module("starter.services", [])

        .service("AccessService", ["$rootScope", "$http", "$q", "WORDPRESS_API_URL", function (e, n, t, o) {
            
            this.validateAuth = function (e) {
                var s = t.defer();
                return n.jsonp(o + "user/validate_auth_cookie/?cookie=" + e.cookie + "&callback=JSON_CALLBACK").success(function (e) {
                    s.resolve(e);
                }).error(function (e) {
                    s.reject(e);
                }), s.promise;
            }, this.doLogin = function (e) {
                var n = t.defer(),
                    o = t.defer(),
                    s = this;
                return s.requestNonce("user", "generate_auth_cookie").then(function (e) {
                    o.resolve(e);
                }, function(e) {
                    n.reject('Error occured. try after sometime');
                }), o.promise.then(function (t) {
                    s.generateAuthCookie(e.userName, e.password, t).then(function (e) {
                        if ("error" === e.status)
                            n.reject(e.error);
                        else {
                            var t = {
                                cookie: e.cookie,
                                data: e.user,
                                user_id: e.user.id
                            };
                            s.saveUser(t), s.updateUserAvatar().then(function () {
                                n.resolve(t);
                            }, function(e) {
                                n.reject('Error occured. try after sometime');
                            });
                        }
                    }, function(e) {
                        n.reject('Error occured. try after sometime');
                    });
                }), n.promise;
            }, this.doRegister = function (e) {
                var n = t.defer(),
                        o = t.defer(),
                        s = this;
                return s.requestNonce("user", "register").then(function (e) {
                    o.resolve(e);
                }, function(e) {
                    n.reject('Error occured. try after sometime');
                }), o.promise.then(function (t) {
                    s.registerUser(e.userName, e.email, e.displayName, e.password, t).then(function (t) {
                        "error" === t.status ? n.reject(t.error) : s.doLogin(e).then(function () {
                            n.resolve(e);
                        });
                    }, function(e) {
                        n.reject('Error occured. try after sometime');
                    });
                }), n.promise;
            }, this.requestNonce = function (e, s) {
                var i = t.defer();
                return n.jsonp(o + "get_nonce/?controller=" + e + "&method=" + s + "&callback=JSON_CALLBACK").success(function (e) {
                    i.resolve(e.nonce);
                }).error(function (e) {
                    i.reject(e);
                }), i.promise;
            }, this.forgotPassword = function (e) {
                var s = t.defer();
                return n.jsonp(o + "user/retrieve_password/?user_login=" + e + "&callback=JSON_CALLBACK").success(function (e) {
                    s.resolve(e);
                }).error(function (e) {
                    s.reject(e);
                }), s.promise;
            }, this.generateAuthCookie = function (e, s, i) {
                var a = t.defer();
                return n.jsonp(o + "user/generate_auth_cookie/?username=" + e + "&password=" + s + "&nonce=" + i + "&callback=JSON_CALLBACK").success(function (e) {
                    a.resolve(e);
                }).error(function (e) {
                    a.reject(e);
                }), a.promise;
            }, this.saveUser = function (e) {
                window.localStorage.user = JSON.stringify(e)
            }, this.getUser = function () {
                return {
                    avatar: JSON.parse(window.localStorage.user_avatar || null),
                    data: JSON.parse(window.localStorage.user || null).data,
                    cookie: JSON.parse(window.localStorage.user || null).cookie
                }
            }, this.registerUser = function (e, s, i, a, r) {
                var l = t.defer();
                return n.jsonp(o + "user/register/?username=" + e + "&email=" + s + "&display_name=" + i + "&user_pass=" + a + "&nonce=" + r + "&callback=JSON_CALLBACK").success(function (e) {
                    l.resolve(e);
                }).error(function (e) {
                    l.reject(e);
                }), l.promise;
            }, this.userIsLoggedIn = function () {
                var e = t.defer(),
                        n = JSON.parse(window.localStorage.user || null);
                return null !== n && null !== n.cookie ? this.validateAuth(n).then(function (n) {
                    e.resolve(n.valid);
                }, function(n) {
                    e.reject('Error occured. try after sometime');
                }) : e.resolve(!1), e.promise;
            }, this.logOut = function () {
                window.localStorage.user = null, window.localStorage.user_avatar = null
            }, this.updateUserAvatar = function () {
                var e = t.defer(),
                    s = JSON.parse(window.localStorage.user || null);
                return n.jsonp(o + "user/get_avatar/?user_id=" + s.user_id + "&type=full&callback=JSON_CALLBACK").success(function (n) {
                    window.localStorage.user_avatar = JSON.stringify(n.avatar), e.resolve(n.avatar)
                }).error(function (n) {
                    e.reject(n);
                }), e.promise;
            };
        }])
        .service("PostService", function($http, $q, WORDPRESS_JSON_API_URL, WORDPRESS_API_URL, AccessService){
            this.getPosts = function(filters) {
                var filterQuery = '',
                    postsApi,
                    defer = $q.defer();

                if (filters.length) {
                    filterQuery = '&' + filters.join('&');
                }
                postsApi = WORDPRESS_JSON_API_URL + 'posts?_jsonp=JSON_CALLBACK'+ filterQuery;
                return $http.jsonp(postsApi).success(function(e) {
                    defer.resolve(e);
                }).error(function(e) {
                    defer.reject(e);
                }), defer.promise;
            };
            this.getPost = function(postId) {
                var postApi,
                    defer = $q.defer();
                postApi = WORDPRESS_JSON_API_URL + 'posts/' + postId + '?_jsonp=JSON_CALLBACK';
                return $http.jsonp(postApi).success(function(e) {
                    defer.resolve(e);
                }).error(function(e) {
                    defer.reject(e);
                }), defer.promise;
            };
            this.getComments = function(postId) {
                var postApi,
                    defer = $q.defer();
                postApi = WORDPRESS_JSON_API_URL + 'posts/' + postId + '/comments?_jsonp=JSON_CALLBACK';
                return $http.jsonp(postApi).success(function(e) {
                    defer.resolve(e);
                }).error(function(e) {
                    defer.reject(e);
                }), defer.promise;
            };
            this.submitComment = function(postId, content) {
                var a = $q.defer(),
                    r = AccessService.getUser();
                return $http.jsonp(WORDPRESS_API_URL + "user/post_comment/?post_id=" + postId + "&cookie=" + r.cookie + "&comment_status=1&content=" + content + "&callback=JSON_CALLBACK").success(function(e) {
                    a.resolve(e);
                }).error(function(e) {
                    a.reject(e);
                }), a.promise;
            };
            this.getUserGravatar = function(userId) {
                var s = $q.defer();
                return $http.jsonp(WORDPRESS_API_URL + "user/get_avatar/?user_id=" + userId + "&type=full&callback=JSON_CALLBACK").success(function(e) {
                    s.resolve(e);
                }).error(function(e) {
                    s.reject(e);
                }), s.promise;
            };
        });