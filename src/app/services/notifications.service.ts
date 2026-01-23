import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export enum NotificationType {
  VOTE = 'vote',
  RESULTS_SHOWN = 'results_shown',
  RESULTS_HIDDEN = 'results_hidden',
  RESTART = 'restart',
  NEW_PARTICIPANT = 'new_participant',
  PARTICIPANT_LEFT = 'participant_left',
  TASK_SELECTED = 'task_selected',
  VOTING_STARTED = 'voting_started'
}

export interface NotificationSettings {
  soundsEnabled: boolean;
  vibrationsEnabled: boolean;
  toastEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private audioContext: AudioContext | null = null;
  private settings: NotificationSettings = {
    soundsEnabled: true,
    vibrationsEnabled: true,
    toastEnabled: true
  };

  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.loadSettings();
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    // El AudioContext se inicializará cuando sea necesario (lazy initialization)
    // Esto evita problemas con políticas de autoplay de los navegadores
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('AudioContext no disponible:', error);
        return null;
      }
    }
    
    return this.audioContext;
  }

  /**
   * Intenta activar el AudioContext si está suspendido
   * Útil para activar el contexto cuando el usuario interactúa por primera vez
   */
  public activateAudioContext(): Promise<void> {
    return new Promise((resolve) => {
      const audioContext = this.getAudioContext();
      if (!audioContext) {
        resolve();
        return;
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          resolve();
        }).catch(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private loadSettings(): void {
    const saved = localStorage.getItem('notification-settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  saveSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem('notification-settings', JSON.stringify(this.settings));
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Reproduce un sonido usando Web Audio API
   */
  private playSound(frequency: number, duration: number = 200, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine'): void {
    if (!this.settings.soundsEnabled) {
      return;
    }

    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return;
    }

    // Intentar activar el contexto si está suspendido antes de reproducir
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        this.playSoundInternal(audioContext, frequency, duration, type);
      }).catch(() => {
        // Si no se puede activar, intentar reproducir de todas formas
        this.playSoundInternal(audioContext, frequency, duration, type);
      });
    } else {
      this.playSoundInternal(audioContext, frequency, duration, type);
    }
  }

  /**
   * Método interno para reproducir el sonido
   */
  private playSoundInternal(audioContext: AudioContext, frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle'): void {
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error al reproducir sonido:', error);
    }
  }

  /**
   * Vibra el dispositivo si está disponible
   */
  private vibrate(pattern: number | number[] = 200): void {
    if (!this.settings.vibrationsEnabled || !navigator.vibrate) {
      return;
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibración no disponible:', error);
    }
  }

  /**
   * Muestra una notificación toast mejorada
   */
  private showToast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string, life: number = 3000): void {
    if (!this.settings.toastEnabled) {
      return;
    }

    this.messageService.add({
      severity,
      summary,
      detail,
      life,
      closable: true,
      styleClass: 'custom-toast'
    });
  }

  /**
   * Notifica cuando alguien vota
   */
  notifyVote(userName: string, isOwnVote: boolean = false): void {
    if (isOwnVote) {
      // Sonido más suave para el propio voto
      this.playSound(400, 150, 'sine');
    } else {
      // Sonido más notorio para votos de otros
      this.playSound(600, 200, 'sine');
      this.vibrate(100);
      
    }
  }

  /**
   * Notifica cuando se muestran los resultados
   */
  notifyResultsShown(): void {
    // Sonido de revelación (ascendente)
    this.playSoundSequence([400, 500, 600], 150);
    this.vibrate([100, 50, 100]);
    
    // Toast eliminado por solicitud del usuario
    // Solo se mantienen sonidos y vibraciones
  }

  /**
   * Notifica cuando se ocultan los resultados
   */
  notifyResultsHidden(): void {
    this.playSound(300, 150, 'sine');
    
    // Toast eliminado por solicitud del usuario
    // Solo se mantienen sonidos y vibraciones
  }

  /**
   * Notifica cuando se reinicia la votación
   */
  notifyRestart(): void {
    // Sonido de reinicio (descendente)
    this.playSoundSequence([600, 500, 400], 150);
    this.vibrate([200, 100, 200]);
  }

  /**
   * Notifica cuando un nuevo participante se une
   */
  notifyNewParticipant(userName: string): void {
    this.playSound(500, 200, 'sine');
    this.vibrate(150);
    
    this.translate.get('NOTIFICATIONS.NEW_PARTICIPANT', { name: userName }).subscribe(msg => {
      this.showToast('success', this.translate.instant('NOTIFICATIONS.PARTICIPANT'), msg, 3000);
    });
  }

  /**
   * Notifica cuando un participante se va
   */
  notifyParticipantLeft(userName: string): void {
    this.playSound(300, 150, 'sine');
    
    this.translate.get('NOTIFICATIONS.PARTICIPANT_LEFT', { name: userName }).subscribe(msg => {
      this.showToast('info', this.translate.instant('NOTIFICATIONS.PARTICIPANT'), msg, 2000);
    });
  }

  /**
   * Notifica cuando se selecciona una nueva tarea
   */
  notifyTaskSelected(taskTitle: string): void {
    this.playSound(450, 180, 'sine');
    
    this.translate.get('NOTIFICATIONS.TASK_SELECTED', { task: taskTitle }).subscribe(msg => {
      this.showToast('info', this.translate.instant('NOTIFICATIONS.TASK'), msg, 3000);
    });
  }

  /**
   * Notifica cuando comienza una nueva votación
   */
  notifyVotingStarted(): void {
    // Sonido de inicio (ascendente más largo)
    this.playSoundSequence([300, 400, 500, 600], 200);
    this.vibrate([100, 50, 100, 50, 200]);
    
    this.translate.get('NOTIFICATIONS.VOTING_STARTED').subscribe(msg => {
      this.showToast('success', this.translate.instant('NOTIFICATIONS.START'), msg, 3000);
    });
  }

  /**
   * Reproduce una secuencia de sonidos
   */
  private playSoundSequence(frequencies: number[], duration: number): void {
    if (!this.settings.soundsEnabled) {
      return;
    }

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playSound(freq, duration);
      }, index * duration);
    });
  }

  /**
   * Notificación genérica personalizada
   */
  notify(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string, playSound: boolean = false, soundFreq: number = 500): void {
    if (playSound) {
      this.playSound(soundFreq, 200);
    }
    this.showToast(severity, summary, detail);
  }
}
