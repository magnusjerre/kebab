import * as React from "react";
import { PurchasePost, SizeEnum, StrengthEnum, DeliveryTime, Dish, PriceSizeFrontend } from "./../models";
import { sizeToString, fetchCsrf, strengthToStringName, deliveryTimeToStringName } from "./../utils";
import { IPurchase } from "./purchase-interface";
import { EnumListComponent } from "./EnumListComponent";
import { PriceSizeList } from "./PriceSizeList";
import { TextArea } from "../shared/TextArea";

const StrengthComponent : React.StatelessComponent<{value: StrengthEnum, strength: StrengthEnum, label: string, change: (strength: StrengthEnum) => void}> = ({value, strength, label, change}) => (
    <label><input type="radio" id="strength" value={value} checked={value === strength} onChange={() => change(strength)} /> {label}</label>
);

const DeliveryTimeComponent : React.StatelessComponent<{value: DeliveryTime, deliveryTime: DeliveryTime, label: string, change: (deliveryTime: DeliveryTime) => void}> = ({value, deliveryTime, label, change}) => (
    <label><input type="radio" id="strength" value={value} checked={value === deliveryTime} onChange={() => change(deliveryTime)} /> {label}</label>
);

export class PurchaseRegistration extends React.Component<IPurchase, PurchasePost> {
    constructor(props: IPurchase) {
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
                    value: 3,
                    max: props.maxGrade
                },
                strength: StrengthEnum.MEDIUM,
                deliveryTime: DeliveryTime.OK,
                comment: ""
            }
        };
        this.setPurchaseStrength = this.setPurchaseStrength.bind(this);
        this.setRatingStrength = this.setRatingStrength.bind(this);
        this.setGrade = this.setGrade.bind(this);
        this.setDeliveryTime = this.setDeliveryTime.bind(this);
        this.setPriceSize = this.setPriceSize.bind(this);
        this.setComment = this.setComment.bind(this);
    }

    setPurchaseStrength(strength: StrengthEnum) {
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

    setPriceSize(priceSize: PriceSizeFrontend) {
        this.setState({
            ...this.state,
            purchaseInfo: {
                price: priceSize.price,
                size: priceSize.size.size,
                strength: this.state.purchaseInfo.strength
            }
        });
    }

    setComment(comment: String) {
        this.setState({
            ...this.state,
            ratingInfo: {
                ...this.state.ratingInfo,
                comment
            }
        });
    }

    render() {
        const strengthValues = [StrengthEnum.MILD, StrengthEnum.MEDIUM, StrengthEnum.HOT, StrengthEnum.INTENSE];
        const deliveryTimes = [DeliveryTime.SLOW, DeliveryTime.OK, DeliveryTime.FAST];
        const {purchaseInfo, ratingInfo} = this.state;
        const selectedPriceSize = this.props.dish.priceSizes.filter(ps => ps.size.size == purchaseInfo.size)[0]; 
        return (
            <div>
                <div className="card">
                    <h2 className="title">Hva kjøpte du?</h2>
                    <PriceSizeList idBase="price-size" select={this.setPriceSize} selected={selectedPriceSize} values={this.props.dish.priceSizes}/>
                    <EnumListComponent enumToString={strengthToStringName} idBase="pi-strength" select={this.setPurchaseStrength} selected={purchaseInfo.strength} title="" values={strengthValues}/>
                </div>
                <div className="card">
                    <h2 className="title">Hva synes du?</h2>
                    <label htmlFor="rating" className="rating-label">Karakter 
                        <div className="rating-container">
                            <input type="range" min="1" max={this.state.ratingInfo.rating.max} value={this.state.ratingInfo.rating.value} className="rating-slider" id="rating" name="rating" onChange={this.setGrade}/>
                            {
                                `${this.state.ratingInfo.rating.value} / ${this.state.ratingInfo.rating.max}` 
                            }
                        </div>
                    </label>
                    
                    <EnumListComponent enumToString={deliveryTimeToStringName} idBase="ri-delivery-time" select={this.setDeliveryTime} selected={ratingInfo.deliveryTime} title="Leveringstid" values={deliveryTimes} />
                    
                    <EnumListComponent enumToString={strengthToStringName} idBase="ri-strength" select={this.setRatingStrength} selected={ratingInfo.strength} title="Styrke" values={strengthValues}/>
                    <TextArea id="comment" name="comment" label="Kommentar" onChange={this.setComment} value={this.state.ratingInfo.comment}/>
                </div>
                <button className="kebab-button-large" onClick={() => {
                    fetchCsrf().then((csrf: string) => {
                        fetch("/api/closed/purchase", {
                            method: "POST",
                            credentials: "same-origin",
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrf,
                            },
                            body: JSON.stringify(this.state)
                        }).then((response: Response) => {
                            this.props.onRegistered();
                        });
                    });
                }}>Registrer</button>
                <button className="kebab-button-large" onClick={this.props.cancel} >Avbryt</button>
            </div>
        );
    }
}