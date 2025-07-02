import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement} from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { PaymentService } from '../../services/payment.service';
import { BehaviorSubject, combineLatest, filter, firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnInit, OnDestroy {
 @Input() bookingId!: number;
  @Input() amount!: number;

  @ViewChild('cardNumberElement') cardNumberRef!: ElementRef;
  @ViewChild('cardExpiryElement') cardExpiryRef!: ElementRef;
  @ViewChild('cardCvcElement') cardCvcRef!: ElementRef;

  stripe: Stripe | null = null;
  cardNumberElement!: StripeCardNumberElement;
  cardExpiryElement!: StripeCardExpiryElement;
  cardCvcElement!: StripeCardCvcElement;
  
  private clientSecret!: string;

  private stripeReady$ = new BehaviorSubject<Stripe | null>(null);
  private clientSecretReady$ = new BehaviorSubject<string | null>(null);
  private viewReady$ = new BehaviorSubject<boolean>(false);
  private setupDone = false;

  isLoading = true;
  paymentError: string | null = null;
  paymentSuccess = false;

  constructor(private paymentService: PaymentService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    loadStripe(environment.PublishableKey).then(stripe => this.stripeReady$.next(stripe));
    
    firstValueFrom(this.paymentService.createPaymentIntent(3))
      .then(response => this.clientSecretReady$.next(response.clientSecret))
      .catch(err => this.paymentError = "Failed to get payment secret.");
  }

  ngAfterViewInit(): void {
    // 2. أخبر الجميع أن الـ DOM جاهز
    this.viewReady$.next(true);
    
    // 3. اشترك في كل الشروط، وعندما تتحقق كلها، قم بالإعداد
    combineLatest([this.stripeReady$, this.clientSecretReady$, this.viewReady$]).pipe(
      filter(([stripe, secret, view]) => !!stripe && !!secret && view && !this.setupDone),
      take(1)
    ).subscribe(([stripe, secret, _]) => {
      this.stripe = stripe;
      this.clientSecret = secret!;
      this.setupStripeElements();
      this.setupDone = true; // لمنع إعادة التنفيذ
    });
  }

  setupStripeElements(): void {
    if (!this.stripe) return;
    const elements = this.stripe.elements({ clientSecret: this.clientSecret });
    const style = { base: { fontSize: '16px' } };
    
    this.cardNumberElement = elements.create('cardNumber', { style, showIcon: true });
    this.cardNumberElement.mount(this.cardNumberRef.nativeElement);

    this.cardExpiryElement = elements.create('cardExpiry', { style });
    this.cardExpiryElement.mount(this.cardExpiryRef.nativeElement);

    this.cardCvcElement = elements.create('cardCvc', { style });
    this.cardCvcElement.mount(this.cardCvcRef.nativeElement);
    
    this.isLoading = false; // الآن فقط اعرض الفورم للمستخدم

    this.cardNumberElement.on('change', (event) => {
      this.paymentError = event.error ? event.error.message : null;
      if (event.complete) this.cardExpiryElement.focus();
    });
    this.cardExpiryElement.on('change', (event) => {
      this.paymentError = event.error ? event.error.message : null;
      if (event.complete) this.cardCvcElement.focus();
    });
  }

  async handleSubmit(): Promise<void> {
    if (this.isLoading || !this.stripe || !this.cardNumberElement) return;

    this.isLoading = true;
    this.paymentError = null;

    const { error,paymentIntent  } = await this.stripe.confirmCardPayment(
      this.clientSecret,
      { payment_method: { card: this.cardNumberElement } }
    );

    this.isLoading = false;

    if (error) {
      this.paymentError = error.message ?? "An unknown error occurred.";
    } else if (paymentIntent?.status === 'succeeded') { // <-- التحقق هنا
      this.paymentSuccess = true;
      setTimeout(() => this.router.navigate(['/booking-success', this.bookingId]), 2000);
    } else {
      // حالة أخرى مثل 'requires_action'
      this.paymentError = "Further action is required to complete the payment.";
    }
  }

  ngOnDestroy(): void {
    if (this.cardNumberElement) this.cardNumberElement.destroy();
    if (this.cardExpiryElement) this.cardExpiryElement.destroy();
    if (this.cardCvcElement) this.cardCvcElement.destroy();
  }
}
