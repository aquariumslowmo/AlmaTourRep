const TOURS = {
  kolsay: {
    id: 'kolsay',
    name: 'Kolsay Lake Tour',
    location: 'Almaty Region',
    region: 'Almaty region · Kazakhstan',
    price: '25,000',
    rating: 4.8,
    reviews: 324,
    duration: '9 hrs',
    start: '7:00 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Nature',
    heroImg: 'images/kolsay.jpg',
    mapQuery: 'Kolsay+Lake+Kazakhstan',
    desc: 'Discover the breathtaking beauty of the Kolsai Lakes, known as the "Pearls of the Northern Tien Shan". Enjoy crystal-clear waters, lush forests, and peaceful mountain landscapes.',
    about: 'The Kolsai Lakes tour takes you to one of the most beautiful natural destinations in Kazakhstan. Surrounded by dense forests and majestic mountains, these alpine lakes offer breathtaking views and a peaceful atmosphere.\nDuring the tour, you will visit the first Kolsai Lake, walk along scenic trails, take stunning photos, and enjoy fresh mountain air. This trip is perfect for nature lovers, photographers, and anyone looking to escape the city.',
    itinerary: [
      { time: '07:00', label: 'Departure from Almaty', milestone: true },
      { time: '10:30', label: 'Arrival at Kolsai Lakes' },
      { time: '11:00', label: 'Hiking and exploration' },
      { time: '13:30', label: 'Free time & photography', milestone: true },
      { time: '15:00', label: 'Return to Almaty' },
      { time: '19:00', label: 'Arrival in the city', milestone: true },
    ],
    included: ['Transportation', 'Guide', 'Entrance fees'],
    excluded: ['Food', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    ]
  },
 
  shymbulak: {
    id: 'shymbulak',
    name: 'Shymbulak Mountain Resort',
    location: 'Almaty, Medeu district',
    region: 'Almaty region · Kazakhstan',
    price: '30,000',
    rating: 4.8,
    reviews: 4564,
    duration: 'Half day',
    start: '9:00 AM',
    meeting: 'Medeu Ice Rink Entrance',
    badge: 'Nature',
    heroImg: 'images/shymb.jpg',
    mapQuery: 'Shymbulak+Ski+Resort+Almaty',
    desc: 'Experience the stunning alpine scenery of Shymbulak Mountain Resort, nestled at 2,200 meters in the Zailiysky Alatau range, just 25 km from central Almaty.',
    about: 'Shymbulak is Central Asia\'s premier mountain resort, offering breathtaking panoramic views of the Tian Shan mountain range. Whether you\'re an adventure seeker or simply want to breathe fresh mountain air, this tour has something for everyone.\nRide the gondola from Medeu to the summit station, explore scenic walking trails, and enjoy refreshments with spectacular views. Guides will share the history and ecology of the region throughout the trip.',
    itinerary: [
      { time: '09:00', label: 'Departure from Medeu', milestone: true },
      { time: '09:30', label: 'Gondola ride to Shymbulak' },
      { time: '10:00', label: 'Mountain exploration & walking trails' },
      { time: '12:00', label: 'Lunch break with mountain views', milestone: true },
      { time: '13:00', label: 'Free time for photos & activities' },
      { time: '14:00', label: 'Return gondola ride & departure', milestone: true },
    ],
    included: ['Gondola ticket', 'Guide', 'Transport from Medeu'],
    excluded: ['Lunch', 'Equipment rental', 'Personal expenses'],
    gallery: [
      'images/shymb.jpg',
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    ]
  },
 
  charyn: {
    id: 'charyn',
    name: 'Charyn Canyon',
    location: 'Almaty Region, Yenbekshikazakh District',
    region: 'Almaty region · Kazakhstan',
    price: '20,000',
    rating: 4.8,
    reviews: 2897,
    duration: '8 hrs',
    start: '6:00 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Adventure',
    heroImg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85',
    mapQuery: 'Charyn+Canyon+Kazakhstan',
    desc: 'Explore the magnificent Charyn Canyon, often called the "Grand Canyon\'s little brother". Marvel at ancient red rock formations carved by the Charyn River over millions of years.',
    about: 'Charyn Canyon stretches for 90 kilometers and reaches depths of up to 300 meters. The Valley of Castles section features towering orange and red rock formations that seem to belong to another world.\nYour guide will lead you along the canyon floor trail, explaining the geological history of this natural wonder. The trip includes a riverside walk and ample time for photography among the dramatic rock formations.',
    itinerary: [
      { time: '06:00', label: 'Departure from Almaty', milestone: true },
      { time: '09:00', label: 'Arrival at Charyn Canyon' },
      { time: '09:30', label: 'Canyon floor hike – Valley of Castles' },
      { time: '12:00', label: 'Picnic lunch by the river', milestone: true },
      { time: '13:00', label: 'Free exploration & photography' },
      { time: '15:00', label: 'Departure back to Almaty', milestone: true },
      { time: '18:00', label: 'Arrival in the city' },
    ],
    included: ['Transportation', 'Guide', 'Entrance fees', 'Picnic lunch'],
    excluded: ['Additional snacks', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    ]
  },
 
  kaindy: {
    id: 'kaindy',
    name: 'Kaindy Lake',
    location: 'Almaty Region',
    region: 'Almaty region · Kazakhstan',
    price: '20,000',
    rating: 4.7,
    reviews: 2724,
    duration: '9 hrs',
    start: '6:30 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Nature',
    heroImg: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=85',
    mapQuery: 'Kaindy+Lake+Kazakhstan',
    desc: 'Visit the surreal Kaindy Lake, formed by a 1911 earthquake, where submerged birch trees rise eerily from its turquoise waters — one of Kazakhstan\'s most unique natural sights.',
    about: 'Kaindy Lake was created when a massive limestone landslide, triggered by the 1911 Kebin earthquake, blocked a mountain gorge and formed a natural dam. The flooded valley submerged a birch forest, leaving the skeletal trunks standing in icy turquoise water.\nThe tour includes a scenic hike through the Kolsai gorge, followed by a breathtaking reveal of the lake. The cold, clear water maintains excellent visibility, and the surrounding spruce forests and rocky peaks make this a truly one-of-a-kind experience.',
    itinerary: [
      { time: '06:30', label: 'Departure from Almaty', milestone: true },
      { time: '10:00', label: 'Arrival at Kolsai gorge trail' },
      { time: '10:30', label: 'Hike through the gorge to Kaindy' },
      { time: '12:00', label: 'Arrival at Kaindy Lake', milestone: true },
      { time: '12:00', label: 'Free time, photos & exploration' },
      { time: '14:00', label: 'Return hike & departure', milestone: true },
      { time: '18:00', label: 'Arrival in Almaty' },
    ],
    included: ['Transportation', 'Guide', 'Entrance fees'],
    excluded: ['Food & drinks', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    ]
  },
 
  medeu: {
    id: 'medeu',
    name: 'Medeu Ice Rink',
    location: 'Almaty, Medeu',
    region: 'Almaty region · Kazakhstan',
    price: '25,000',
    rating: 4.3,
    reviews: 534,
    duration: '6 hrs',
    start: '10:00 AM',
    meeting: 'Medeu Bus Stop',
    badge: 'Adventure',
    heroImg: 'images/medeu.jpg',
    mapQuery: 'Medeu+Ice+Rink+Almaty',
    desc: 'Skate at the world\'s highest outdoor ice rink, Medeu, set at 1,691 meters above sea level with spectacular mountain views all around.',
    about: 'Medeu is one of Almaty\'s most iconic landmarks. The rink was built in 1972 and has hosted numerous world skating records thanks to its clean mountain air and high altitude. Surrounded by the breathtaking Zailiysky Alatau mountains, it offers a uniquely memorable experience.\nThe tour includes transport to Medeu, skate rental, a guided session on the ice, and time to explore the surrounding area and the Shymbulak gondola lower station.',
    itinerary: [
      { time: '10:00', label: 'Meeting at Medeu Bus Stop', milestone: true },
      { time: '10:15', label: 'Skate rental & warm-up session' },
      { time: '10:30', label: 'Ice skating session' },
      { time: '12:30', label: 'Break & exploration of surroundings', milestone: true },
      { time: '13:30', label: 'Optional gondola ride to Shymbulak' },
      { time: '15:00', label: 'Departure back to city', milestone: true },
    ],
    included: ['Skate rental', 'Guide', 'Entrance fees'],
    excluded: ['Food & drinks', 'Gondola ticket', 'Personal expenses'],
    gallery: [
      'images/medeu.jpg',
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    ]
  },
 
  koktobe: {
    id: 'koktobe',
    name: 'Kok-Tobe Hill',
    location: 'Almaty Region',
    region: 'Almaty region · Kazakhstan',
    price: '18,000',
    rating: 4.8,
    reviews: 2364,
    duration: '4 hrs',
    start: '11:00 AM',
    meeting: 'Kok-Tobe Cable Car Station',
    badge: 'City tours',
    heroImg: 'images/kok-tobe.jpg',
    mapQuery: 'Kok-Tobe+Hill+Almaty',
    desc: 'Take in panoramic views of Almaty from Kok-Tobe Hill, reached by a scenic cable car ride. Enjoy attractions, the Beatles statue, and sweeping city vistas from 1,100 meters.',
    about: 'Kok-Tobe is a hill overlooking central Almaty at 1,100 meters above sea level, accessible by a Swiss-made cable car. At the top you\'ll find a TV tower, an amusement park, and various cafés with stunning views.\nHighlights include a photo op with the famous Beatles statues, panoramic views of the Tian Shan mountains and the city skyline, and a relaxing stroll around the hilltop park. Perfect for first-time visitors and families.',
    itinerary: [
      { time: '11:00', label: 'Meet at Cable Car Station', milestone: true },
      { time: '11:15', label: 'Cable car ride to summit' },
      { time: '11:30', label: 'Guided tour of hilltop attractions' },
      { time: '12:30', label: 'Free time & photography', milestone: true },
      { time: '13:30', label: 'Cable car descent' },
      { time: '14:00', label: 'Tour ends', milestone: true },
    ],
    included: ['Cable car ticket', 'Guide', 'Park entrance'],
    excluded: ['Food & drinks', 'Amusement rides', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    ]
  },
  ayusai: {
    id: 'ayusai',
    name: 'Ayusai Waterfall',
    location: 'Almaty Region, Ile-Alatau',
    region: 'Almaty region · Kazakhstan',
    price: '15,000',
    rating: 4.6,
    reviews: 1120,
    duration: '5 hrs',
    start: '9:00 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Nature',
    heroImg: 'images/ayusai.jpg',
    mapQuery: 'Ayusai+Waterfall+Almaty+Kazakhstan',
    desc: 'Discover the hidden Ayusai Waterfall nestled in the gorges of Ile-Alatau National Park. A refreshing half-day escape with lush greenery, cool mist and peaceful forest trails.',
    about: 'The Ayusai gorge is one of Almaty\'s most accessible yet rewarding nature escapes. A moderate hike through spruce forest leads you to a beautiful cascading waterfall fed by glacial snowmelt.\nThe trail winds alongside a crystal-clear mountain stream, with wildflowers lining the path in spring and summer. This tour is ideal for families, beginners, and anyone wanting a quick nature fix close to the city.',
    itinerary: [
      { time: '09:00', label: 'Departure from Almaty', milestone: true },
      { time: '09:45', label: 'Arrival at Ayusai gorge trailhead' },
      { time: '10:00', label: 'Hike through the gorge' },
      { time: '11:00', label: 'Arrival at Ayusai Waterfall', milestone: true },
      { time: '11:30', label: 'Free time, photos & rest' },
      { time: '12:30', label: 'Return hike & departure back to Almaty', milestone: true },
    ],
    included: ['Transportation', 'Guide', 'Park entrance fee'],
    excluded: ['Food & drinks', 'Personal expenses'],
    gallery: [
      'images/ayusai.jpg',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    ]
  },
 
  kokzhailau: {
    id: 'kokzhailau',
    name: 'Kok Zhailau Plateau',
    location: 'Almaty, Ile-Alatau National Park',
    region: 'Almaty region · Kazakhstan',
    price: '18,000',
    rating: 4.9,
    reviews: 3210,
    duration: '6 hrs',
    start: '8:00 AM',
    meeting: 'Ecopark Entrance, Almaty',
    badge: 'Nature',
    heroImg: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=85',
    mapQuery: 'Kok+Zhailau+Plateau+Almaty',
    desc: 'Hike up to the iconic Kok Zhailau plateau for sweeping panoramic views of Almaty and the surrounding Tian Shan peaks. One of the most beloved trails in Kazakhstan.',
    about: 'Kok Zhailau — meaning "Blue Summer Pasture" in Kazakh — is a sprawling highland meadow at 2,100 meters, reachable by a well-trodden trail from the city\'s outskirts. The plateau bursts with wildflowers in summer and offers unobstructed views of the entire Almaty valley.\nThe hike is moderately challenging and takes about 2 hours up. Your guide will share stories of nomadic history and local ecology along the way. At the top, rest and enjoy packed snacks while taking in one of Central Asia\'s most spectacular urban views.',
    itinerary: [
      { time: '08:00', label: 'Meeting at Ecopark Entrance', milestone: true },
      { time: '08:15', label: 'Trail briefing & start of hike' },
      { time: '10:00', label: 'Arrival at Kok Zhailau plateau', milestone: true },
      { time: '10:30', label: 'Panoramic views, rest & snack break' },
      { time: '11:30', label: 'Descent begins' },
      { time: '13:00', label: 'Return to trailhead & departure', milestone: true },
    ],
    included: ['Guide', 'Park entrance fee', 'Snack break'],
    excluded: ['Transportation to trailhead', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    ]
  },
 
  almaarasan: {
    id: 'almaarasan',
    name: 'Alma-Arasan Gorge',
    location: 'Almaty, Ile-Alatau',
    region: 'Almaty region · Kazakhstan',
    price: '12,000',
    rating: 4.5,
    reviews: 876,
    duration: '4 hrs',
    start: '10:00 AM',
    meeting: 'Alma-Arasan Sanatorium Gate',
    badge: 'Nature',
    heroImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=85',
    mapQuery: 'Alma-Arasan+Gorge+Almaty',
    desc: 'Stroll through the tranquil Alma-Arasan gorge, home to a natural hot spring resort, pine forests, and a gently flowing mountain river. A relaxing half-day in nature.',
    about: 'Alma-Arasan gorge is just 12 km from central Almaty, yet it feels worlds away. The valley is named after its famous hot radon springs, used for health and relaxation since Soviet times.\nThis tour takes you along the river trail through the gorge, past fruit orchards and pine groves, with optional access to the natural hot spring pools at the sanatorium. A great choice for a gentle, restorative nature walk.',
    itinerary: [
      { time: '10:00', label: 'Meeting at Alma-Arasan gate', milestone: true },
      { time: '10:15', label: 'Guided walk through the gorge' },
      { time: '11:15', label: 'Hot spring viewing & optional soak', milestone: true },
      { time: '12:00', label: 'River trail return walk' },
      { time: '13:00', label: 'Tour ends', milestone: true },
    ],
    included: ['Guide', 'Gorge entrance'],
    excluded: ['Hot spring access fee', 'Food & drinks', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    ]
  },
 
  terrenkur: {
    id: 'terrenkur',
    name: 'Terrenkur Trail',
    location: 'Almaty, Medeu district',
    region: 'Almaty region · Kazakhstan',
    price: '10,000',
    rating: 4.7,
    reviews: 1540,
    duration: '3 hrs',
    start: '9:00 AM',
    meeting: 'Medeu Ice Rink Entrance',
    badge: 'City tours',
    heroImg: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1400&q=85',
    mapQuery: 'Terrenkur+Trail+Almaty+Medeu',
    desc: 'Walk the legendary Terrenkur — a scenic therapeutic mountain path running from Medeu to Shymbulak. Enjoy fresh alpine air, pine forests, and stunning city views below.',
    about: 'The Terrenkur is a historic walking path built in Soviet times as a prescribed "health trail" for patients of mountain sanatoriums. Today it is beloved by locals and tourists alike as a gentle uphill walk through forest with spectacular views.\nStarting at Medeu and winding up through pine trees toward Shymbulak, the trail is clearly marked and suitable for all fitness levels. Your guide will point out native flora, fauna, and share the cultural history of the route.',
    itinerary: [
      { time: '09:00', label: 'Meeting at Medeu entrance', milestone: true },
      { time: '09:15', label: 'Begin Terrenkur trail walk' },
      { time: '10:00', label: 'Mid-trail rest point with city views', milestone: true },
      { time: '10:30', label: 'Continue to upper Shymbulak zone' },
      { time: '11:30', label: 'Return & tour end', milestone: true },
    ],
    included: ['Guide', 'Trail access'],
    excluded: ['Gondola ticket', 'Food & drinks', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=600&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    ]
  },
 
  assy: {
    id: 'assy',
    name: 'Assy Plateau',
    location: 'Almaty Region, Enbekshikazakh District',
    region: 'Almaty region · Kazakhstan',
    price: '28,000',
    rating: 4.8,
    reviews: 1876,
    duration: '10 hrs',
    start: '7:00 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Adventure',
    heroImg: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=85',
    mapQuery: 'Assy+Plateau+Kazakhstan',
    desc: 'Journey to the vast Assy Plateau at 2,700 meters — a rolling highland steppe used by nomads for centuries. Experience real Kazakh pastoral life, yurts, horses and boundless sky.',
    about: 'The Assy Plateau is one of the most dramatic landscapes accessible from Almaty. At 2,700 meters above sea level, the plateau stretches for dozens of kilometers, dotted with yurts, grazing horses, and traditional nomadic camps in summer.\nThe road up is itself spectacular — a serpentine mountain pass with vertiginous drops and sweeping valley views. At the top, your guide will introduce you to local herders and you can try traditional koumiss (fermented mare\'s milk) and freshly baked bread.',
    itinerary: [
      { time: '07:00', label: 'Departure from Almaty', milestone: true },
      { time: '09:30', label: 'Arrival at Assy Plateau' },
      { time: '10:00', label: 'Visit nomadic yurt camp', milestone: true },
      { time: '11:30', label: 'Horseback riding & free exploration' },
      { time: '13:00', label: 'Traditional lunch in yurt', milestone: true },
      { time: '14:30', label: 'Scenic descent & departure' },
      { time: '17:00', label: 'Arrival back in Almaty', milestone: true },
    ],
    included: ['Transportation', 'Guide', 'Yurt visit', 'Traditional lunch'],
    excluded: ['Horseback riding fee', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
    ]
  },
 
  turgen: {
    id: 'turgen',
    name: 'Turgen Waterfalls',
    location: 'Almaty Region, Turgen Gorge',
    region: 'Almaty region · Kazakhstan',
    price: '22,000',
    rating: 4.7,
    reviews: 2105,
    duration: '8 hrs',
    start: '7:30 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Nature',
    heroImg: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=1400&q=85',
    mapQuery: 'Turgen+Gorge+Waterfalls+Almaty+Kazakhstan',
    desc: 'Explore the stunning Turgen Gorge with its series of seven waterfalls, the famous bear\'s cave, and ancient petroglyphs — one of the most diverse day trips from Almaty.',
    about: 'The Turgen Gorge is a natural wonderland packed with waterfalls, wildlife and history. The main attraction is the Medvezhy (Bear\'s) Waterfall, but the gorge also contains six other cascades, a thermal spring, and rock carvings estimated to be 3,000 years old.\nYour guide will lead you through forest trails connecting the waterfalls, sharing geological and historical context at each stop. This is a moderately active tour with some uneven terrain — comfortable hiking shoes are recommended.',
    itinerary: [
      { time: '07:30', label: 'Departure from Almaty', milestone: true },
      { time: '09:30', label: 'Arrival at Turgen Gorge' },
      { time: '10:00', label: 'Hike to Bear\'s Waterfall', milestone: true },
      { time: '11:00', label: 'Explore additional falls & petroglyphs' },
      { time: '12:30', label: 'Picnic lunch in the gorge', milestone: true },
      { time: '13:30', label: 'Return hike & departure' },
      { time: '15:30', label: 'Arrival back in Almaty', milestone: true },
    ],
    included: ['Transportation', 'Guide', 'Park entrance', 'Picnic lunch'],
    excluded: ['Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=600&q=80',
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    ]
  },
 
  bartogay: {
    id: 'bartogay',
    name: 'Bartogay Reservoir',
    location: 'Almaty Region, Chilik River',
    region: 'Almaty region · Kazakhstan',
    price: '20,000',
    rating: 4.6,
    reviews: 934,
    duration: '9 hrs',
    start: '7:00 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Nature',
    heroImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85',
    mapQuery: 'Bartogay+Reservoir+Kazakhstan',
    desc: 'Visit the turquoise waters of Bartogay Reservoir set against a backdrop of snow-capped peaks. A peaceful destination for photography, picnics and mountain lake scenery.',
    about: 'Bartogay Reservoir was created in the 1970s on the Chilik River and has since become one of the most photogenic lakes in the Almaty region. Its striking turquoise color comes from glacial sediment, and the surrounding landscape of dry steppe meeting snowy mountains is unlike anywhere else in Kazakhstan.\nThis tour combines the reservoir visit with stops at local villages and a chance to spot eagles and other steppe birds. The light is especially magical in early morning and late afternoon.',
    itinerary: [
      { time: '07:00', label: 'Departure from Almaty', milestone: true },
      { time: '09:30', label: 'Arrival at Bartogay Reservoir' },
      { time: '10:00', label: 'Lakeside walk & photography', milestone: true },
      { time: '11:30', label: 'Village visit & local interaction' },
      { time: '13:00', label: 'Picnic lunch by the lake', milestone: true },
      { time: '14:30', label: 'Departure back to Almaty' },
      { time: '17:00', label: 'Arrival in Almaty', milestone: true },
    ],
    included: ['Transportation', 'Guide', 'Picnic lunch'],
    excluded: ['Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    ]
  },
 
  issyk: {
    id: 'issyk',
    name: 'Issyk Lake',
    location: 'Almaty Region, Issyk District',
    region: 'Almaty region · Kazakhstan',
    price: '17,000',
    rating: 4.5,
    reviews: 1688,
    duration: '7 hrs',
    start: '8:00 AM',
    meeting: 'Almaty Central Bus Station',
    badge: 'Nature',
    heroImg: 'https://images.unsplash.com/photo-1478827217976-7214a0556393?w=1400&q=85',
    mapQuery: 'Issyk+Lake+Almaty+Kazakhstan',
    desc: 'Visit Issyk Lake, a beautiful glacial lake in the Tian Shan foothills famous for its emerald water and the legendary Golden Man archaeological museum nearby.',
    about: 'Issyk Lake sits at 1,756 meters in a scenic glacial valley 70 km east of Almaty. Though a catastrophic mudflow in 1963 dramatically changed its size, the lake remains one of the region\'s most beautiful destinations.\nThe tour visits both the lake and the Issyk town museum, which houses replicas of the famous "Golden Man" — a Saka warrior buried in a suit of golden armor, one of Kazakhstan\'s greatest archaeological discoveries. A perfect combination of natural and cultural history.',
    itinerary: [
      { time: '08:00', label: 'Departure from Almaty', milestone: true },
      { time: '09:30', label: 'Arrival at Issyk town museum (Golden Man)' },
      { time: '10:30', label: 'Drive to Issyk Lake', milestone: true },
      { time: '11:00', label: 'Lakeside walk & photography' },
      { time: '12:30', label: 'Lunch at local restaurant', milestone: true },
      { time: '14:00', label: 'Departure back to Almaty' },
      { time: '15:30', label: 'Arrival in Almaty', milestone: true },
    ],
    included: ['Transportation', 'Guide', 'Museum entry'],
    excluded: ['Lunch', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1478827217976-7214a0556393?w=600&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    ]
  },
 
  panfilov: {
    id: 'panfilov',
    name: 'Panfilov Park',
    location: 'Almaty City Center',
    region: 'Almaty · Kazakhstan',
    price: '8,000',
    rating: 4.6,
    reviews: 2230,
    duration: '3 hrs',
    start: '10:00 AM',
    meeting: 'Panfilov Park Main Gate, Gogol St.',
    badge: 'City tours',
    heroImg: 'https://images.unsplash.com/photo-1514565131-fce0801e6f4e?w=1400&q=85',
    mapQuery: 'Panfilov+Park+Almaty+Kazakhstan',
    desc: 'Explore Almaty\'s most beloved city park, home to the magnificent Zenkov Cathedral, the Memorial of Glory, and a peaceful green oasis in the heart of the city.',
    about: 'Panfilov Park is named after the 28 Panfilov Guardsmen who defended Moscow in World War II. At its heart stands the Ascension Cathedral (Zenkov Cathedral), a stunning wooden Russian Orthodox church built entirely without nails in 1907 — one of the tallest wooden buildings in the world.\nThis city walking tour covers the cathedral, the Eternal Flame memorial, the Military History Museum, and the park\'s beautiful tree-lined alleys. A perfect introduction to Almaty\'s history and architecture.',
    itinerary: [
      { time: '10:00', label: 'Meeting at park main gate', milestone: true },
      { time: '10:15', label: 'Zenkov Cathedral visit & history' },
      { time: '11:00', label: 'Memorial of Glory & Eternal Flame', milestone: true },
      { time: '11:30', label: 'Military History Museum (exterior)' },
      { time: '12:00', label: 'Park stroll & free time', milestone: true },
      { time: '13:00', label: 'Tour ends' },
    ],
    included: ['Guide', 'Cathedral entrance'],
    excluded: ['Museum entry', 'Food & drinks', 'Personal expenses'],
    gallery: [
      'https://images.unsplash.com/photo-1514565131-fce0801e6f4e?w=600&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=600&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
    ]
  },
};
 
// ── Populate page from URL param ──────────────────────────────────────
function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('tour') || 'kolsay';
  const tour = TOURS[id] || TOURS['kolsay'];
 
  document.title = `AlmaTour | ${tour.name}`;
 
  // Hero background
  document.getElementById('detailHero').style.backgroundImage = `url('${tour.heroImg}')`;
 
  // Text content
  document.getElementById('detailTitle').textContent = tour.name;
  document.getElementById('detailLocation').textContent = `${tour.location} | ${tour.rating}`;
 
  // Rating line
  const stars = '★'.repeat(Math.round(tour.rating)) + '☆'.repeat(5 - Math.round(tour.rating));
  document.getElementById('detailRatingLine').innerHTML = `<span style="color:#f59e0b">${stars}</span> (${tour.reviews} reviews)`;
 
  // Booking card
  document.getElementById('bcPrice').textContent = `${tour.price} ₸`;
  document.getElementById('bcStars').innerHTML = `${'★'.repeat(Math.round(tour.rating))}<span style="color:#d1d5db">${'★'.repeat(5 - Math.round(tour.rating))}</span> (${tour.reviews} reviews)`;
 
  // Map
  document.getElementById('mapIframe').src =
    `https://maps.google.com/maps?q=${tour.mapQuery}&output=embed`;
 
  // Book Now → passes data to booking page
  const bookParams = new URLSearchParams({
    tour: tour.id,
    name: tour.name,
    img: tour.heroImg,
    price: tour.price.replace(',', ''),
    duration: tour.duration,
    start: tour.start,
    meeting: tour.meeting,
  });
  document.getElementById('btnBookNow').href = `booking.html?${bookParams}`;
 
  // Description
  document.getElementById('detailDesc').textContent = tour.desc;
  document.getElementById('detailAbout').innerHTML = tour.about.replace(/\n/g, '<br><br>');
 
  // Itinerary
  const iList = document.getElementById('itineraryList');
  tour.itinerary.forEach(item => {
    const li = document.createElement('li');
    if (item.milestone) li.classList.add('milestone');
    li.textContent = `${item.time} — ${item.label}`;
    iList.appendChild(li);
  });
 
  // Included / Excluded
  const incList = document.getElementById('includedList');
  const excList = document.getElementById('excludedList');
  tour.included.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    incList.appendChild(li);
  });
  tour.excluded.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    excList.appendChild(li);
  });
 
  // Gallery
  const gallery = document.getElementById('galleryGrid');
  tour.gallery.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = tour.name;
    img.loading = 'lazy';
    gallery.appendChild(img);
  });
}
 
init();