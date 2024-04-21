const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'x-nextjs-data': '1',
    'DNT': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-GPC': '1',
    'Connection': 'keep-alive',
    'TE': 'trailers'
};


// Please update the promotion_information as needed
const promotional_information = `
*New Customers Offer Terms and Conditions
Offer valid for new Chewy customers only. Must add $49.00 worth of eligible items to cart and enter code WELCOME to receive $20 e-Gift card. Limit 1 use per order, limit 1 order per customer. Free e-Gift card added at checkout with qualifying purchase and automatically added to your Chewy account after your order ships. Customer must be logged into account to view all applicable promotions. Excludes, gift cards, Purina Pro Plan, Diamond, Taste of the Wild, Castor & Pollux, and Vet Diet brands as well as select Beggin', DentaLife, Dog Chow, Fancy Feast, Friskies, Purina Beneful, Purina Beyond, Purina ONE, Tidy Cats, Tidy Max, and other select items. Subject to Chewy Gift Card terms and conditions found here: https://chewy.com/app/content/gift-cards-terms. Gift cards cannot be returned, refunded, or redeemed for cash as required by law. Valid through 4/29/24 6:29AM ET, while supplies last, subject to Terms.
`

export { headers, promotional_information };

