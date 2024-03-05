import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public publickeyEncoded = '';
  private privateKeyEncoded = '';

  public textToEncrypt: string = '';
  public encryptedText: string = '';
  public decriptedText: string = '';
  /**
   * Generate and print the public and private key on console.
   *
   * Both keys are in base64 format
   */
  public async generateKeys(): Promise<void> {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const exportedPublicKey = await window.crypto.subtle.exportKey(
      'spki',
      publicKey
    );

    const exportedPrivateKey = await window.crypto.subtle.exportKey(
      'pkcs8',
      privateKey
    );

    this.publickeyEncoded = this.arrayBufferToBase64(exportedPublicKey);
    this.privateKeyEncoded = this.arrayBufferToBase64(exportedPrivateKey);

    console.log('Exported Public Key:', this.publickeyEncoded);
    console.log('Exported Private Key:', this.privateKeyEncoded);
  }

  public async encrypt(): Promise<any> {
    const publicKeyImport = await this.getPublicKey();

    const encoder = new TextEncoder();
    const encodedText = encoder.encode(this.textToEncrypt);

    const encryptedText = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKeyImport,
      encodedText
    );

    this.encryptedText = this.arrayBufferToBase64(encryptedText);
    console.log(this.encryptedText);
  }

  public async decript(): Promise<void> {
    const resultRaw = await fetch('http://127.0.0.1:3000/decript', {
      method: 'POST',

      body: JSON.stringify({
        privateKeyEncoded: this.privateKeyEncoded,
        encryptedText: this.encryptedText,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const responseParsed = await resultRaw.json();
    this.decriptedText = responseParsed.text;
  }

  private getPublicKey(): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'spki',
      this.base64ToUint8Array(this.publickeyEncoded),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    );
  }

  private arrayBufferToBase64(pArrayBuffer: ArrayBuffer): string {
    const valueArray = new Uint8Array(pArrayBuffer);
    return window.btoa(String.fromCharCode.apply(null, valueArray as any));
  }

  private base64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
