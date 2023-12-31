import { ref } from 'vue';
import { defineStore } from 'pinia';
import { AuthService } from '../services/authService';
import { killToken, killUser, saveToken, setUser } from '../common/headerAuth';
import { useToast } from "vue-toastification";
import type { AxiosError } from 'axios';

type CatchError = AxiosError<any, any>

export const useAuth = defineStore('auth', () => {
  const toast = useToast()
  const authService = new AuthService();
  
  const token = ref(localStorage.getItem('authToken') || '')

  async function login(email: string, password: string) {
    try {
      const response = await authService.login(email, password)
      token.value = response.token
      
      saveToken(token.value)
      setUser(response.user)

      toast.success('User logged in successfully')
    } catch (error: unknown) {
      let errorMsg = error as CatchError
      toast.error(errorMsg.response?.data)
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      await authService.register(name, email, password)
      toast.success('User registered successfully')
    } catch (error: unknown) {
      let errorMsg = error as CatchError
      toast.error(errorMsg.response?.data)
    }
  }

  async function logout() {
    token.value = ''
    killToken()
    killUser()
  }

  return {
    token,
    login,
    register,
    logout
  }

})