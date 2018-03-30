import * as React from "react";
import { PurchasePost, SizeEnum, StrengthEnum, DeliveryTime, Dish } from "./models";
import { sizeToString, fetchCsrf } from "./utils";

interface IPurchaseRegistrationProps {
    dish: Dish
    maxGrade: number
}

const StrengthComponent : React.StatelessComponent<{value: StrengthEnum, strength: StrengthEnum, label: string, change: (strength: StrengthEnum) => void}> = ({value, strength, label, change}) => (
    <label><input type="radio" id="strength" value={value} checked={value === strength} onChange={() => change(strength)} /> {label}</label>
);

const DeliveryTimeComponent : React.StatelessComponent<{value: DeliveryTime, deliveryTime: DeliveryTime, label: string, change: (deliveryTime: DeliveryTime) => void}> = ({value, deliveryTime, label, change}) => (
    <label><input type="radio" id="strength" value={value} checked={value === deliveryTime} onChange={() => change(deliveryTime)} /> {label}</label>
);

export class PurchaseRegistration extends React.Component<IPurchaseRegistrationProps, PurchasePost> {
    constructor(props: IPurchaseRegistrationProps) {
        super(props);
        this.state = {
            dishId: props.dish.id,
            purchaseInfo: {
                price: props.dish.priceSizes[0].price,
                size: props.dish.priceSizes[0].size.size,
                strength: StrengthEnum.MEDIUM
            },
            ratingInfo: {
                rating: {
                    value: 0,
                    max: props.maxGrade
                },
                strength: StrengthEnum.MEDIUM,
                deliveryTime: DeliveryTime.OK
            }
        };
        this.setStrength = this.setStrength.bind(this);
        this.setRatingStrength = this.setRatingStrength.bind(this);
        this.setGrade = this.setGrade.bind(this);
        this.setDeliveryTime = this.setDeliveryTime.bind(this);
    }

    setStrength(strength: StrengthEnum) {
        this.setState({
            ...this.state,
            purchaseInfo: {
                ...this.state.purchaseInfo,
                strength: strength
            }
        });
    }

    setRatingStrength(strength: StrengthEnum) {
        this.setState({
            ...this.state,
            ratingInfo: {
                ...this.state.ratingInfo,
                strength: strength
            }
        });
    }

    setGrade(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            ratingInfo: {
                ...this.state.ratingInfo,
                rating: {
                    value: parseInt(event.currentTarget.value),
                    max: this.state.ratingInfo.rating.max
                }
            }
        });
    }

    setDeliveryTime(deliveryTime: DeliveryTime) {
        this.setState({
            ...this.state,
            ratingInfo: {
                ...this.state.ratingInfo,
                deliveryTime: deliveryTime
            }
        });
    }

    render() {
        return (
            <div>
                <h2>Gjennomfør kjøp</h2>
                <div className="card">
                    <label htmlFor="price-size">Hva har du kjøpt?</label>
                    {
                        this.props.dish.priceSizes.map(ps => {
                            return (
                                <div className="price-size-component">
                                    <input type="radio" id="price-size" name="price-size" value={ps.size.size} checked={this.state.purchaseInfo.size == ps.size.size} onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        this.setState({
                                            ...this.state,
                                            purchaseInfo: {
                                                price: ps.price,
                                                size: ps.size.size,
                                                strength: this.state.purchaseInfo.strength
                                            }
                                        });
                                    }}/>
                                    <span>{sizeToString(ps.size.size)} - {ps.price} kr</span>
                                </div>
                            );
                        })
                    }
                    <StrengthComponent value={this.state.purchaseInfo.strength} strength={StrengthEnum.MILD} label="Mild" change={this.setStrength} />
                    <StrengthComponent value={this.state.purchaseInfo.strength} strength={StrengthEnum.MEDIUM} label="Medium" change={this.setStrength} />
                    <StrengthComponent value={this.state.purchaseInfo.strength} strength={StrengthEnum.HOT} label="Hot" change={this.setStrength} />
                    <StrengthComponent value={this.state.purchaseInfo.strength} strength={StrengthEnum.INTENSE} label="Intens" change={this.setStrength} />
                </div>
                <div className="card">
                    <label htmlFor="rating">Karakter <input type="number" id="rating" name="ratin" max={this.props.maxGrade} min={0} value={this.state.ratingInfo.rating.value} onChange={this.setGrade} /></label>
                    
                    <h3>Styrke</h3>
                    <StrengthComponent value={this.state.ratingInfo.strength} strength={StrengthEnum.MILD} label="Mild" change={this.setRatingStrength} />
                    <StrengthComponent value={this.state.ratingInfo.strength} strength={StrengthEnum.MEDIUM} label="Medium" change={this.setRatingStrength} />
                    <StrengthComponent value={this.state.ratingInfo.strength} strength={StrengthEnum.HOT} label="Hot" change={this.setRatingStrength} />
                    <StrengthComponent value={this.state.ratingInfo.strength} strength={StrengthEnum.INTENSE} label="Intens" change={this.setRatingStrength} />

                    <h3>Levering</h3>
                    <DeliveryTimeComponent value={this.state.ratingInfo.deliveryTime} deliveryTime={DeliveryTime.SLOW} label="Treig" change={this.setDeliveryTime}/>
                    <DeliveryTimeComponent value={this.state.ratingInfo.deliveryTime} deliveryTime={DeliveryTime.OK} label="Forventet" change={this.setDeliveryTime}/>
                    <DeliveryTimeComponent value={this.state.ratingInfo.deliveryTime} deliveryTime={DeliveryTime.FAST} label="Rask" change={this.setDeliveryTime}/>                    
                </div>
                <button onClick={() => {
                    fetchCsrf().then((csrf: string) => {
                        fetch("/api/closed/purchase", {
                            method: "POST",
                            credentials: "same-origin",
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrf,
                            },
                            body: JSON.stringify(this.state)
                        })
                    });
                }}>Registrer</button>
            </div>
        );
    }
}