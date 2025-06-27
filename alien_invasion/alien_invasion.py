import sys  ##sys 是 Python 的标准库模块，主要用于与 Python 解释器及其运行时环境交互。它提供了访问和维护解释器相关功能的能力
import pygame
from settings import settings
from ship import Ship
from bullet import Bullet
from alien import Alien

class AlienInvasion:
    def __init__(self):
        pygame.init()

        # self.screen = pygame.display.set_mode((1200,800))##窗口大小
        pygame.display.set_caption("Alien Invasion")
##使用存储的参数
        self.settings = settings()

        self.screen = pygame.display.set_mode(
            (0,0),pygame.FULLSCREEN)###全屏
        self.settings.screen_width = self.screen.get_rect().width
        self.settings.screen_height = self.screen.get_rect().height
        self.clock = pygame.time.Clock()##帧率控制
        #
        # self.bg_color = (230,230,230)##白色屏幕
        self.ship = Ship(self)

        self.bullets = pygame.sprite.Group()##子弹
        self.aliens = pygame.sprite.Group()##外星人

        self._create_fleet()

    def run_game(self):

        while 1:

            self.check_events()
            self.ship.update()
            self.update_screen()
            self.bullets.update()
            self._update_aliens()
            self.clock.tick(60)  ##每秒60次


            # for event in pygame.event.get():
            #             #             #     if event.type == pygame.QUIT:
            #             #             #         sys.exit() #使用 sys.exit() 终止程序运行（可指定退出码）

            # self.screen.fill(self.bg_color)##屏幕颜色



            # self.screen.fill(self.settings.bg_color)
            # self.ship.blitme()
            # pygame.display.flip()  ##调用了 pygame.display.flip()，命令 Pygame 让最近绘制的屏幕可见。这
#里，它在每次执行 while 循环时都绘制一个空屏幕，并擦去旧屏幕，使得只有新的空
#屏幕可见

            #
    def _update_aliens(self):
        self._check_fleet_edges()
        self.aliens.update()####这里的update是Group里面的update方法

    def _check_fleet_edges(self):
        for alien in self.aliens.sprites():
            if alien.check_edges():
                self._change_fleet_direction()
                break

    def _change_fleet_direction(self):
        for alien in self.aliens.sprites():
            alien.rect.y += self.settings.fleet_drop_speed
        self.settings.fleet_direction *= -1


    def check_events(self):
        for event in pygame.event.get():
            if event.type ==pygame.QUIT:
                sys.exit()####交互按键模块功能细化
            elif event.type == pygame.KEYDOWN:

                self._check_key_down_events(event)
            #         ##右移动飞船
            #         # self.ship.rect.x +=1
            #         self.ship.moving_right = True
            #     elif event.key == pygame.K_LEFT:
            #         self.ship.moving_left = True
            elif event.type == pygame.KEYUP:
                 self._check_key_up_events(event)
            #     if event.key == pygame.K_RIGHT:
            #         self.ship.moving_right = False
            #     elif event.key == pygame.K_LEFT:
            #         self.ship.moving_left = False


    def _fire_bullet(self):

        new_bullet = Bullet(self)
        self.bullets.add(new_bullet)

    def _create_fleet(self):
        alien = Alien(self)
        # self.aliens.add(alien)##成功创建了外星人

        alien_width,alien_height = alien.rect.size###sizze是一个属性，不可以写出size（）,这是一个方法

        current_x,current_y = alien_width,alien_height
        while current_y < (self.settings.screen_height - 3 * alien_height):
            while current_x < (self.settings.screen_width - 2* alien_width):
            # new_alien = Alien(self)
            # new_alien.x = current_x
            # new_alien.rect.x = current_x
            # self.aliens.add(new_alien)
            # current_x += 2*alien_width
            # ###成功创建了一排外星人
            #
                self._create_alien(current_x,current_y)
                current_x += 2 * alien_width

            current_x = alien_width
            current_y += 2 * alien_height






    def _create_alien(self,x_position,y_position):
        new_alien = Alien(self)
        new_alien.x = x_position
        new_alien.rect.x = x_position
        new_alien.rect.y = y_position
        self.aliens.add(new_alien)







    def update_screen(self):
        self.screen.fill(self.settings.bg_color)

        for bullet in self.bullets.sprites():
            bullet.draw_bullet()

        self.ship.blitme()
        self.aliens.draw(self.screen)
        pygame.display.flip()
        # self.clock.tick(60)  ##每秒60次  时钟放这里不合适

    def _check_key_down_events(self,event):

        if event.key == pygame.K_RIGHT:
            ##右移动飞船
            # self.ship.rect.x +=1
            self.ship.moving_right = True
        elif event.key == pygame.K_LEFT:
            # sys.exit()
            self.ship.moving_left = True

        elif event.key == pygame.K_ESCAPE:
             sys.exit()

        elif event.key == pygame.K_SPACE:
            self._fire_bullet()
        ####退出的时候，由于我的笔记本电脑键盘不是常规键码值，如果要定义q键退出，需要先按shift后在按q键，简单起见，定义esc


    def _check_key_up_events(self,event):

        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = False






if __name__ == '__main__':
    ai = AlienInvasion()
    ai.run_game()
###初步完成  结果是创建了一个空窗口

###哎呦！！！今天2025.6.22，太忙了，怎么办，偷个懒

###哎呦！！！今天2025.6.23，太忙了，怎么办，偷个懒


###哎呦！！！今天2025.6.24，太忙了，怎么办，偷个懒

###哎呦！！！今天2025.6.25，太忙了，怎么办，偷个懒
##哦哦哦哦，今天放个假


