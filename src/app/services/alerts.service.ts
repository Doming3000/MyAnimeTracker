import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AlertService {
	// Subject para manejar alertas tipo toast
	private alertSubject = new Subject<{ type: string; title: string; message: string }>();
	
	// Subject para manejar confirmaciones
	private confirmSubject = new Subject<{
		title: string;
		message: string;
		yesText: string;
		noText: string;
		callback: () => void;
		cancelCallback?: () => void;
	}>();
	
	constructor() {}
	
	// Método para emitir alertas tipo toast
	triggerAlert(type: string, title: string, message: string): void {
		this.alertSubject.next({ type, title, message });
	}
	
	// Observable para escuchar alertas tipo toast
	getAlert$(): Observable<{ type: string; title: string; message: string }> {
		return this.alertSubject.asObservable();
	}
	
	// Método para emitir confirmaciones
	triggerConfirm(options: {
		title: string;
		message: string;
		yesText: string;
		noText: string;
		callback: () => void;
		cancelCallback?: () => void;
	}): void {
		this.confirmSubject.next(options);
	}
	
	// Observable para escuchar confirmaciones
	getConfirm$(): Observable<{
		title: string;
		message: string;
		yesText: string;
		noText: string;
		callback: () => void;
		cancelCallback?: () => void;
	}> {
		return this.confirmSubject.asObservable();
	}
}