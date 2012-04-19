/*!
 * jq.notification
 * chrome style notification bar
 *
 * @version      0.1.0
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         https://github.com/5509/jq.notification
 *
 * 2012-04-19 04:29
 */
(function($, undefined) {

  $.notification = (function() {
    function Notification(conf) {
      this.namespace = 'Notification';
      if ( this instanceof Notification ) {
        return this.init(conf);
      }
      return new Notification(conf);
    }
    Notification.prototype.init = function(conf) {
      var self = this;

      self.conf = $.extend({
        content: 'this is content',
        yes: 'yes',
        no: 'no',
        easing: 'swing',
        duration: 0.2,
        wait: 0,
        closeLabel: '&times;',
        addClass: undefined,
        barClass: 'notification_bar',
        btnsClass: 'notification_btns',
        closeBtnClass: 'notification_close',
        contentClass: 'notification_content'
      }, conf);

      self._createBar();
      self._eventify();

      $('body').append(self.$bar);
      self.height = self.$bar[0].offsetHeight;
      self.$bar.css('top', -self.height).hide();
    };
    Notification.prototype._eventify = function() {
      var self = this;
      if ( self.$yes ) {
        self.$yes.click(function() {
          self.$bar.trigger('notificationYes');
        });
      }
      if ( self.$no ) {
        self.$no.click(function() {
          self.$bar.trigger('notificationNo');
        });
      }
      self.$close.click(function() {
        self.hide();
      });
    };
    Notification.prototype._createBar = function() {
      var self = this,
          conf = self.conf;

      self.$bar = $('<div class="' + conf.barClass + '"></div>').addClass(conf.addClass);
      self.$btns = $('<div class="' + conf.btnsClass + '"></div>');
      self.$close = $('<span class="' + conf.closeBtnClass + '">' + conf.closeLabel + '</span>');
      self.$content = $('<p class="' + conf.contentClass + '">' + conf.content + '</div>');
      self.$yes = undefined;
      self.$no = undefined;

      self.$bar.append(
        self.$content,
        self.$close
      );

      if ( conf.yes ) {
        self.$yes = $('<input type="button" value="' + conf.yes + '">');
        self.$btns.append(self.$yes);
      }
      if ( conf.no ) {
        self.$no = $('<input type="button" value="' + conf.no + '">');
        self.$btns.append(self.$no);
      }

      if ( !conf.yes && !conf.no ) return;
      self.$bar.append(self.$btns);
    };
    Notification.prototype._changeMessage = function(msg) {
      var self = this;
      self.$content.text(msg);
    };
    Notification.prototype._changeClass = function(klass) {
      var self = this;
      self.$bar
        .attr('class', 'notification_bar')
        .addClass(klass);
    };
    Notification.prototype.bind = function() {
      var self = this,
          a = arguments,
          c = undefined,
          bind = function(listener, func) {
            if ( !/notificationYes|notificationNo/.test(listener) ) return;
            self.$bar.bind(listener, func);
          };

      if ( typeof a[0] === 'object' ) {
        for ( c in a[0] ) {
          bind(c, a[0][c]);
        }
      } else {
        bind(a[0], a[1]);
      }
    };
    Notification.prototype.show = function(instanceConf) {
      var self = this,
          conf = self.conf,
          insConf = $.extend({
            wait: undefined,
            autoHide: false,
            message: false,
            klass: false
          }, instanceConf),
          wait = (insConf.wait || conf.wait) * 1000;

      if ( self.displayTimer ) {
        clearTimeout(self.displayTimer);
      }

      if ( insConf.message ) {
        self._changeMessage(insConf.message);
      }
      if ( insConf.klass ) {
        self._changeClass(insConf.klass);
      }
      self.$bar.show();

      setTimeout(function() {
        self.$bar.animate({
          top: 0
        }, {
          easing: conf.easing,
          duration: conf.duration * 1000,
          complete: function() {
            self.$bar.trigger('notificationShow');
          }
        });
      }, wait);

      if ( insConf.autoHide ) {
        self.displayTimer = setTimeout(function() {
          self.hide();
        }, insConf.autoHide * 1000 + wait);
      }
    };
    Notification.prototype.hide = function() {
      var self = this,
          conf = self.conf;

      if ( self.displayTimer ) {
        clearTimeout(self.displayTimer);
      }
      self.$bar.animate({
        top: -self.height
      }, {
        easing: conf.easing,
        duration: conf.duration * 1000,
        complete: function() {
          self.$bar.hide();
          self.$bar.trigger('notificationHide');
        }
      });
    };
    Notification.prototype.destroy = function() {
      var self = this;
      self.$bar.remove();
    };

    return Notification;
  }());

}(jQuery));
