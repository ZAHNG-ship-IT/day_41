
import sys
import pygame
from settings import settings
from ship import Ship

class AlienInvasion:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("Alien Invasion")
        self.settings = settings()
        self.screen = pygame.display.set_mode(
            (self.settings.screen_width, self.settings.screen_height))
        self.clock = pygame.time.Clock()
        self.ship = Ship(self)

    def run_game(self):
        while True:
            self.check_events()
            self.update_screen()
            self.clock.tick(60)
            self.ship.update()

    def check_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                self._check_key_down_events(event)
            elif event.type == pygame.KEYUP:
                self._check_key_up_events(event)

    def update_screen(self):
        self.screen.fill(self.settings.bg_color)
        self.ship.blitme()
        pygame.display.flip()

    def _check_key_down_events(self, event):
        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = True
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = True
        elif event.key == pygame.K_q:  # 添加 Q 键退出处理
            sys.exit(0)  # 0 表示正常退出

    def _check_key_up_events(self, event):
        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = False

if __name__ == '__main__':
    ai = AlienInvasion()
    ai.run_game()
