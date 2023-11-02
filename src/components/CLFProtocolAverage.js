import { MathComponent } from "mathjax-react";

export default function CLFProtocolAverage(){
    return (
        <article>
            <MathComponent tex={String.raw`r = \frac{\sigma * \sqrt{d}}{\ln\frac{1}{(LTV + \beta)}*\sqrt{l}}`} />
        </article>
    )
}