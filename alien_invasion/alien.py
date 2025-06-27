import pygame
from pygame.sprite import Sprite

class Alien(Sprite):
    def __init__(self,ai_game):
        super().__init__()

        self.screen = ai_game.screen


        self.image = pygame.image.load('images/生成外星人图片 (1).png')
        self.image = pygame.transform.scale(self.image, (50, 50))  # 调整为 50x50 像素
        self.rect = self.image.get_rect()

        self.settings = ai_game.settings


        self.rect.x = self.rect.width
        self.rect.y = self.rect.height

        self.x = float(self.rect.x)
    def check_edges(self):
        screen_rect = self.screen.get_rect()
        return( self.rect.right >= screen_rect.right or self.rect.left <= 0) #如果位于屏幕边缘，返回True

    def update(self):###右移外星人
        self.x += self.settings.alien_speed * self.settings.fleet_direction
        self.rect.x = int(self.x)
