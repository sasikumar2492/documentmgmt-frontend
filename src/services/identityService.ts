import { authService } from './authService';

export const identityService = {
  async loadCurrentUser() {
    return authService.getCurrentUser();
  }
};

