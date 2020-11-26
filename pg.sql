--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Ubuntu 12.4-1.pgdg16.04+1)
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.categories (
    id character varying NOT NULL,
    parent_id character varying,
    cat_icon character varying,
    cat_name character varying
);


ALTER TABLE public.categories OWNER TO sgykafkphqhreq;

--
-- Name: countries; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.countries (
    code character varying NOT NULL,
    name character varying,
    dial_code character varying
);


ALTER TABLE public.countries OWNER TO sgykafkphqhreq;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.employees (
    id character varying NOT NULL,
    name character varying,
    email character varying,
    phone character varying,
    date_of_birth date,
    created_at date,
    country_code character varying,
    password character varying
);


ALTER TABLE public.employees OWNER TO sgykafkphqhreq;

--
-- Name: merchants; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.merchants (
    id character varying NOT NULL,
    name character varying,
    email character varying,
    website character varying,
    country_code character varying,
    created_at date,
    emp_id character varying NOT NULL,
    password character varying,
    status boolean
);


ALTER TABLE public.merchants OWNER TO sgykafkphqhreq;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.order_items (
    order_id character varying,
    product_id character varying,
    quantity integer
);


ALTER TABLE public.order_items OWNER TO sgykafkphqhreq;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.orders (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    status character varying,
    created_at date,
    "netAmt" bigint,
    "paymentMode" character varying,
    shipper_id character varying,
    addr character varying
);


ALTER TABLE public.orders OWNER TO sgykafkphqhreq;

--
-- Name: products; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.products (
    id character varying NOT NULL,
    name character varying,
    merchant_id character varying NOT NULL,
    price bigint,
    status character varying,
    created_at date,
    category_id character varying,
    description character varying
);


ALTER TABLE public.products OWNER TO sgykafkphqhreq;

--
-- Name: shippers; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.shippers (
    id character varying NOT NULL,
    name character varying,
    email character varying,
    website character varying,
    country_code character varying,
    created_at date,
    password character varying,
    emp_id character varying NOT NULL,
    status boolean
);


ALTER TABLE public.shippers OWNER TO sgykafkphqhreq;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sgykafkphqhreq
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    name character varying,
    email character varying,
    gender character varying,
    phone character varying,
    "walletAmt" bigint,
    date_of_birth date,
    created_at date,
    country_code character varying,
    password character varying
);


ALTER TABLE public.users OWNER TO sgykafkphqhreq;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.categories (id, parent_id, cat_icon, cat_name) FROM stdin;
5f9af0884b3d7a31d1a6b752	\N	master	Master
5f9af0ca4b3d7a31d1a6b754	5f9af0884b3d7a31d1a6b752	handyman	Hardware
5f9af0e54b3d7a31d1a6b755	5f9af0884b3d7a31d1a6b752	weekend	Furniture
5f9af0ef4b3d7a31d1a6b756	5f9af0884b3d7a31d1a6b752	checkroom	Apparel
5f9af8df5554a0c719323c1f	5f9af0884b3d7a31d1a6b752	memory	Electronics
5f9af8fb5554a0c719323c20	5f9af8df5554a0c719323c1f	devices	Portable
5f9af9255554a0c719323c22	5f9af8fb5554a0c719323c20	smartphone	Phones
5f9afa4506d40725cfb3887f	5f9af8fb5554a0c719323c20	laptop	Laptop
5fa050f7e3b79dfcfc05960d	5f9af0884b3d7a31d1a6b752	house	House supplies
5fa0517de3b79dfcfc05960e	5f9af0ca4b3d7a31d1a6b754	plumbing	Plumbing
5fb36db588b3a6c245b4a83f	5f9af8fb5554a0c719323c20	headset	Audio
5fb3711288b3a6c245b4a840	5f9af0ef4b3d7a31d1a6b756	face	Women's
5fb3713488b3a6c245b4a841	5f9af0ef4b3d7a31d1a6b756	sentiment_satisfied	Men's
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.countries (code, name, dial_code) FROM stdin;
AF	Afghanistan	+93
AX	Aland Islands	+358
AL	Albania	+355
DZ	Algeria	+213
AS	AmericanSamoa	+1684
AD	Andorra	+376
AO	Angola	+244
AI	Anguilla	+1264
AQ	Antarctica	+672
AG	Antigua and Barbuda	+1268
AR	Argentina	+54
AM	Armenia	+374
AW	Aruba	+297
AC	Ascension Island	+247
AU	Australia	+61
AT	Austria	+43
AZ	Azerbaijan	+994
BS	Bahamas	+1242
BH	Bahrain	+973
BD	Bangladesh	+880
BB	Barbados	+1246
BY	Belarus	+375
BE	Belgium	+32
BZ	Belize	+501
BJ	Benin	+229
BM	Bermuda	+1441
BT	Bhutan	+975
BO	Bolivia	+591
BA	Bosnia and Herzegovina	+387
BW	Botswana	+267
BR	Brazil	+55
IO	British Indian Ocean Territory	+246
BN	Brunei Darussalam	+673
BG	Bulgaria	+359
BF	Burkina Faso	+226
BI	Burundi	+257
KH	Cambodia	+855
CM	Cameroon	+237
CA	Canada	+1
CV	Cape Verde	+238
KY	Cayman Islands	+1345
CF	Central African Republic	+236
TD	Chad	+235
CL	Chile	+56
CN	China	+86
CX	Christmas Island	+61
CC	Cocos (Keeling) Islands	+61
CO	Colombia	+57
KM	Comoros	+269
CG	Congo	+242
CK	Cook Islands	+682
CR	Costa Rica	+506
HR	Croatia	+385
CU	Cuba	+53
CY	Cyprus	+357
CZ	Czech Republic	+420
CD	Democratic Republic of the Congo	+243
DK	Denmark	+45
DJ	Djibouti	+253
DM	Dominica	+1767
DO	Dominican Republic	+1849
EC	Ecuador	+593
EG	Egypt	+20
SV	El Salvador	+503
GQ	Equatorial Guinea	+240
ER	Eritrea	+291
EE	Estonia	+372
SZ	Eswatini	+268
ET	Ethiopia	+251
FK	Falkland Islands (Malvinas)	+500
FO	Faroe Islands	+298
FJ	Fiji	+679
FI	Finland	+358
FR	France	+33
GF	French Guiana	+594
PF	French Polynesia	+689
GA	Gabon	+241
GM	Gambia	+220
GE	Georgia	+995
DE	Germany	+49
GH	Ghana	+233
GI	Gibraltar	+350
GR	Greece	+30
GL	Greenland	+299
GD	Grenada	+1473
GP	Guadeloupe	+590
GU	Guam	+1671
GT	Guatemala	+502
GG	Guernsey	+44
GN	Guinea	+224
GW	Guinea-Bissau	+245
GY	Guyana	+592
HT	Haiti	+509
VA	Holy See (Vatican City State)	+379
HN	Honduras	+504
HK	Hong Kong	+852
HU	Hungary	+36
IN	India	+91
IS	Iceland	+354
ID	Indonesia	+62
IR	Iran	+98
IQ	Iraq	+964
IE	Ireland	+353
IM	Isle of Man	+44
IL	Israel	+972
IT	Italy	+39
CI	Ivory Coast / Cote d'Ivoire	+225
JM	Jamaica	+1876
JP	Japan	+81
JE	Jersey	+44
JO	Jordan	+962
KZ	Kazakhstan	+77
KE	Kenya	+254
KI	Kiribati	+686
KP	Korea, Democratic People's Republic of Korea	+850
KR	Korea, Republic of South Korea	+82
XK	Kosovo	+383
KW	Kuwait	+965
KG	Kyrgyzstan	+996
LA	Laos	+856
LV	Latvia	+371
LB	Lebanon	+961
LS	Lesotho	+266
LR	Liberia	+231
LY	Libya	+218
LI	Liechtenstein	+423
LT	Lithuania	+370
LU	Luxembourg	+352
MO	Macau	+853
MG	Madagascar	+261
MW	Malawi	+265
MY	Malaysia	+60
MV	Maldives	+960
ML	Mali	+223
MT	Malta	+356
MH	Marshall Islands	+692
MQ	Martinique	+596
MR	Mauritania	+222
MU	Mauritius	+230
YT	Mayotte	+262
MX	Mexico	+52
FM	Micronesia, Federated States of Micronesia	+691
MD	Moldova	+373
MC	Monaco	+377
MN	Mongolia	+976
ME	Montenegro	+382
MS	Montserrat	+1664
MA	Morocco	+212
MZ	Mozambique	+258
MM	Myanmar	+95
NA	Namibia	+264
NR	Nauru	+674
NP	Nepal	+977
NL	Netherlands	+31
AN	Netherlands Antilles	+599
NC	New Caledonia	+687
NZ	New Zealand	+64
NI	Nicaragua	+505
NE	Niger	+227
NG	Nigeria	+234
NU	Niue	+683
NF	Norfolk Island	+672
MK	North Macedonia	+389
MP	Northern Mariana Islands	+1670
NO	Norway	+47
OM	Oman	+968
PK	Pakistan	+92
PW	Palau	+680
PS	Palestine	+970
PA	Panama	+507
PG	Papua New Guinea	+675
PY	Paraguay	+595
PE	Peru	+51
PH	Philippines	+63
PN	Pitcairn	+872
PL	Poland	+48
PT	Portugal	+351
PR	Puerto Rico	+1939
QA	Qatar	+974
RE	Reunion	+262
RO	Romania	+40
RU	Russia	+7
RW	Rwanda	+250
BL	Saint Barthelemy	+590
SH	Saint Helena, Ascension and Tristan Da Cunha	+290
KN	Saint Kitts and Nevis	+1869
LC	Saint Lucia	+1758
MF	Saint Martin	+590
PM	Saint Pierre and Miquelon	+508
VC	Saint Vincent and the Grenadines	+1784
WS	Samoa	+685
SM	San Marino	+378
ST	Sao Tome and Principe	+239
SA	Saudi Arabia	+966
SN	Senegal	+221
RS	Serbia	+381
SC	Seychelles	+248
SL	Sierra Leone	+232
SG	Singapore	+65
SX	Sint Maarten	+1721
SK	Slovakia	+421
SI	Slovenia	+386
SB	Solomon Islands	+677
SO	Somalia	+252
ZA	South Africa	+27
GS	South Georgia and the South Sandwich Islands	+500
SS	South Sudan	+211
ES	Spain	+34
LK	Sri Lanka	+94
SD	Sudan	+249
SR	Suriname	+597
SJ	Svalbard and Jan Mayen	+47
SE	Sweden	+46
CH	Switzerland	+41
SY	Syrian Arab Republic	+963
TW	Taiwan	+886
TJ	Tajikistan	+992
TZ	Tanzania, United Republic of Tanzania	+255
TH	Thailand	+66
TL	Timor-Leste	+670
TG	Togo	+228
TK	Tokelau	+690
TO	Tonga	+676
TT	Trinidad and Tobago	+1868
TN	Tunisia	+216
TR	Turkey	+90
TM	Turkmenistan	+993
TC	Turks and Caicos Islands	+1649
TV	Tuvalu	+688
UG	Uganda	+256
UA	Ukraine	+380
AE	United Arab Emirates	+971
GB	United Kingdom	+44
US	United States	+1
UY	Uruguay	+598
UZ	Uzbekistan	+998
VU	Vanuatu	+678
VE	Venezuela, Bolivarian Republic of Venezuela	+58
VN	Vietnam	+84
VG	Virgin Islands, British	+1284
VI	Virgin Islands, U.S.	+1340
WF	Wallis and Futuna	+681
YE	Yemen	+967
ZM	Zambia	+260
ZW	Zimbabwe	+263
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.employees (id, name, email, phone, date_of_birth, created_at, country_code, password) FROM stdin;
5f99a2d9ab95f7e233c2f722	Karan Kangude	karankangude17@gmail.com	8624891545	2000-01-01	2020-10-28	IN	$2a$10$YcRsk0HVz8F0LjWrpXO6r.Qx3QmCa5y8Lw9jsAQxpjdPAVto6TdSG
5f99a2f7ab95f7e233c2f723	Kaustubh Odak	kaustubhodak1@gmail.com	9650211332	2000-07-02	2020-10-28	IN	$2a$10$oPOP3BsMuuB4u.YCWoEsuuPSKhc7uHviGQPe8nhchxxVfniIT8chm
5f9bb55d964361c2ad39ba70	Joe Smith	joesmith@gmail.com	9999999999	2000-01-01	2020-10-30	US	$2a$10$6BHnmTA1xeR8pJs75jU4Uu8Il5Eyx2c2ujBofGoDarkcc8fQxDJSq
5f9bc224625d59c6ecde3bd2	Abe Shinzo	as@gmail.com	9999999999	2000-01-01	2020-10-30	JP	$2a$10$2GQorpf/10Aw/nkQH6cZP.GEaOqZ6qvv7AMmSBP7O0Jf8VSrvr2z.
5f9bc46e625d59c6ecde3bd3	E Macron	em@gmail.com	9999999999	2000-01-01	2020-10-30	FR	$2a$10$d5BoRpZg3VVSYdzls0kSv.xNnmfZFMZRDilUhEYPmqV7fo1Yab9wG
\.


--
-- Data for Name: merchants; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.merchants (id, name, email, website, country_code, created_at, emp_id, password, status) FROM stdin;
5f99a30dab95f7e233c2f724	Mike Hunt	mikehunt@gmail.com	cosmi.com	IN	2020-10-28	5f99a2d9ab95f7e233c2f722	$2a$10$c59LVmj.Hl4iH03zz03qhuQjKVBW72jdRCp2RsaJd.JAcNWj0Tqo2	t
5f9bd041f44f37c2785a4126	Dave Jones	dj@gmail.com	dj.com	IN	2020-10-30	5f99a2d9ab95f7e233c2f722	$2a$10$/pP9AXfTAa1v9RWCSLmku.f1Sd1xnq9oxy8lKUqDJKHCipQuS0JWu	f
5f9bd05ef44f37c2785a4127	Nathan Drake	nd@gmail.com	nd.com	IN	2020-10-30	5f99a2d9ab95f7e233c2f722	$2a$10$bggcWcpQEa5AV951L02cS.JInb88GhjqbF6HrILV1E1R9wTaGyJdm	f
5f9bd0d5f44f37c2785a4128	Mark Johnson	mj@gmail.com	mj.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$fbhcx8e6zXdNk2zy7LRIQ.861TiRJ2U8solPs.NbTsNRDKIBNOfzq	f
5f9bd0e5f44f37c2785a4129	John Markson	jm@gmail.com	jm.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$dlq508yp2pC30EpXpZ5Mz.c6cnWvRjCV7jaMUOsZgKDneZqzo5vQ2	f
5f9bd11df44f37c2785a412b	Tom Scott	ts@gmail.com	ts.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$BghMVvQoDmfxa/eVyx2CYuz7bPI0DBGMkjwN1iuECLL5esrpHCC8e	f
5f9bd142f44f37c2785a412c	Jack Black	jb@gmail.com	jb.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$hvB4ost/zD8yDlpOTZeqnOIwN9uMlVd4IOvrUPtpErnlEi72KjpzK	f
5f9bd1dcf44f37c2785a412e	Mike Scott	ms@gmail.com	ms.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$0yfaRgpMUZ9092ydHbJhau2JWoM1XV/LMusXa91qF8z70Qsmmnjay	f
5f9bd482f44f37c2785a412f	William Gates	wg@gmail.com	wg.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$PbOHtdA6arJTjkEEI3OTKekO2D1BxpNkoMNMsghEGFt3dvuFVTcNK	f
5f9bd495f44f37c2785a4130	Joe Rogan	jr@gmail.com	jr.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$Nn..6h2PxjUUEYI9eB3IOOuSXhyaEX3uYHjcPPPGQeuJjzh8BJoBG	f
5f9bd6d75a502194c6d046ca	Aiden Pearce	ap@gmail.com	ap.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$ShhYQiW1JsIBGQ7ViH3VJuCW/zsgf/NbrphtndbiiQ8mvLGgn8DzG	f
5f9c2e4b5bad13265672f693	karan kangude	karankangude17@gmail.com	kk.com	IN	2020-10-30	5f99a2f7ab95f7e233c2f723	$2a$10$XgvoRL47a5qjpNIlSHcbN.HHnXQe.nxTIvu8I0KysgJfok8F9HlBe	t
5f9e57943fbf3f4c5f4efb14	Stephan Romero	sr@gmail.com	sr.com	US	2020-11-01	5f9bb55d964361c2ad39ba70	$2a$10$gF23lXH8QolgWBSpTpBxO.W6f1s.94IrPhZ1mbRAcN.T4yhS0vq6O	t
5f9bd5ff5a502194c6d046c8	KS Odak	kso@gmail.com	kso.com	US	2020-10-30	5f9bb55d964361c2ad39ba70	$2a$10$ETPM3IWkXMfqZ6z.z2i29O/7TTdKmoRmZdF/fnNwDqP/dV9.zOvSq	t
5f9d619c449496855a659e23	Ethan Hunt	eh@gmail.com	eh.com	US	2020-10-31	5f9bb55d964361c2ad39ba70	$2a$10$QcmI9aalw5mvIdeyJZuPdepx4Zbpy.mkcP.NL4Df2BUql0CdqSBma	t
5f9e57cb3fbf3f4c5f4efb17	Everett Woodward	ew@gmail.com	ew.com	US	2020-11-01	5f9bb55d964361c2ad39ba70	$2a$10$3yINJf8KfENtvhoMrb1/5unIcLE8LE3QIIygjUJ2iS2OuuJRJAoAS	t
5f9e57b63fbf3f4c5f4efb16	Andy Marriott	am@gmail.com	am.com	US	2020-11-01	5f9bb55d964361c2ad39ba70	$2a$10$lmiXbrlqQT4/TIwgEUHviuj/wrwa56OjJ0DNwCW7nECYXRcxxlx1a	t
5f9e575b3fbf3f4c5f4efb13	Evangeline Reeve	er@gmail.com	er.com	US	2020-11-01	5f9bb55d964361c2ad39ba70	$2a$10$AYJE73So3W91A6fyjM4OXOXRxq.3QWQ3rc94czqWX0.a1xV3BpjNS	t
5f9e57a43fbf3f4c5f4efb15	Hailie Terrell	ht@gmail.com	ht.com	US	2020-11-01	5f9bb55d964361c2ad39ba70	$2a$10$yyy13Egs.QwsZrcj84NsL.oMF/XezgtI5YSFWiOhLxeEX7hDk/CF6	t
5f9e56e43fbf3f4c5f4efb0f	Austin Dean	ad@gmail.com	ad.com	US	2020-11-01	5f9bb55d964361c2ad39ba70	$2a$10$EbmvlPtq.JHp/BU/Q75Lv.AR9BMf.X7nEPXUHdqJ5MsOPPGXYdDQy	t
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.order_items (order_id, product_id, quantity) FROM stdin;
5fbd0f0c44efad4994f4528d	5fb2a2adae91fc4a97d2ec7d	3
5fbd0f0c44efad4994f4528d	5fb39b6a47c2b7afb899d240	2
5fbf4237c707003a45992700	5fb2a2adae91fc4a97d2ec7d	4
5fbf4237c707003a45992700	5fb2a383ae91fc4a97d2ec7e	1
5fbf4489c707003a45992701	5fb376a388b3a6c245b4a846	2
5fbf4489c707003a45992701	5fb39c5c47c2b7afb899d243	2
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.orders (id, user_id, status, created_at, "netAmt", "paymentMode", shipper_id, addr) FROM stdin;
5fbd0f0c44efad4994f4528d	5fbb80a23311e27bd07c94fb	ORDERED	2020-11-25	371000	VISA	5f99a447ab95f7e233c2f726	Pune, Maharashtra
5fbf4237c707003a45992700	5f9a9039ddbdf8e802e8aef3	ordered	2020-11-26	375000	VISA	5f9d645da82a54c9806e20d9	Navi Mumbai, Maharashtra
5fbf4489c707003a45992701	5f9a9039ddbdf8e802e8aef3	ordering	\N	\N	\N	\N	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.products (id, name, merchant_id, price, status, created_at, category_id, description) FROM stdin;
5faab5b995c08f5708e661ac	HP Pavillion	5f99a30dab95f7e233c2f724	34999	AV	\N	5f9af8fb5554a0c719323c20	\N
5fb2a2adae91fc4a97d2ec7d	Acer Nitro 7	5f9bd5ff5a502194c6d046c8	75000	Available	2020-11-16	5f9afa4506d40725cfb3887f	16 GB RAM, Intel i7-11070HQ 6-core processor, Nvidia RTX 2060 6GB GDDR6 graphics, 15.6 inch IPS display, Dolby Surround Sound 
5fb2a383ae91fc4a97d2ec7e	Apple iPhone 12 mini	5f9bd5ff5a502194c6d046c8	75000	Available	2020-11-16	5f9af9255554a0c719323c22	Base variant: 4 GB RAM, 64 GB internal storage, A14 Bionic Chipset, Dual Camera
5fb3732b88b3a6c245b4a842	OnePlus 7T	5f9bd5ff5a502194c6d046c8	40000	Available	2020-11-17	5f9af9255554a0c719323c22	8GB RAM, 256GB Storage, 3 GHz Qualcomm Snapdragon 855 Processor
5fb3738788b3a6c245b4a843	Samsung Galaxy Note 20	5f9bd5ff5a502194c6d046c8	100000	Available	2020-11-17	5f9af9255554a0c719323c22	12GB RAM, 256GB Storage, Exynos 990 8-core processor
5fb3743188b3a6c245b4a844	Google Pixel 5	5f9bd5ff5a502194c6d046c8	80000	Available	2020-11-17	5f9af9255554a0c719323c22	8GB RAM, 128GB storage, 1.8GHz octa-core Qualcomm Snapdragon 765G processor
5fb3762188b3a6c245b4a845	OnePlus 8T 5G	5f9bd5ff5a502194c6d046c8	45000	Available	2020-11-17	5f9af9255554a0c719323c22	12GB RAM, 256GB Storage, 2.86GHz octa-core Qualcomm Snapdragon 865
5fb376a388b3a6c245b4a846	OnePlus Nord 5G	5f9bd5ff5a502194c6d046c8	30000	Available	2020-11-17	5f9af9255554a0c719323c22	12GB RAM, 256GB Storage, 1.8GHz octa-core Qualcomm Snapdragon 765G
5fb3776c88b3a6c245b4a848	Apple iPhone 11	5f9bd5ff5a502194c6d046c8	55000	Available	2020-11-17	5f9af9255554a0c719323c22	4GB RAM, 128GB Storage, A13 Bionic chip
5fb399e847c2b7afb899d23c	MSI GF65	5f9bd5ff5a502194c6d046c8	104000	Available	2020-11-17	5f9afa4506d40725cfb3887f	Intel i5-9300H processor, 8GB RAM, NVidia GeForce RTX 2060 graphics
5fb39a2347c2b7afb899d23d	Lenovo Legion Y540	5f9bd5ff5a502194c6d046c8	118000	Available	2020-11-17	5f9afa4506d40725cfb3887f	Intel i5-9300H processor, 8GB RAM, Nvidia GeForce RTX 2060 graphics
5fb39a8a47c2b7afb899d23e	ASUS TUF A15	5f9bd5ff5a502194c6d046c8	109000	Available	2020-11-17	5f9afa4506d40725cfb3887f	16GB RAM, Ryzen 7 4800H processor, Nvidia GTX 1660Ti 6GB graphics
5fb39b0647c2b7afb899d23f	Acer Predator Triton 300	5f9bd5ff5a502194c6d046c8	86000	Available	2020-11-17	5f9afa4506d40725cfb3887f	Intel i5-9300H processor, 8GB RAM, Nvidia GeForce GTX 1650 graphics
5fb39b6a47c2b7afb899d240	HP Pavilion 15	5f9bd5ff5a502194c6d046c8	73000	Available	2020-11-17	5f9afa4506d40725cfb3887f	Intel i5-9300H processor, 8GB RAM, Nvidia GTX 1650 4GB graphics
5fb39bdf47c2b7afb899d241	Sony WH-1000XM4	5f9bd5ff5a502194c6d046c8	25000	Available	2020-11-17	5fb36db588b3a6c245b4a83f	Wireless noise cancelling headphones with 30 hours battery life, fast charging and Alexa voice control
5fb39c1f47c2b7afb899d242	Sennheiser PXC 550-II	5f9bd5ff5a502194c6d046c8	21000	Available	2020-11-17	5fb36db588b3a6c245b4a83f	Wireless headphones with Alexa, noise cancellation
5fb39c5c47c2b7afb899d243	JBL Tune 700BT	5f9bd5ff5a502194c6d046c8	4000	Available	2020-11-17	5fb36db588b3a6c245b4a83f	Over-ear wireless headphones with 27 hour playtime
5fb39c9947c2b7afb899d244	Blaupunkt BTW Pro	5f9bd5ff5a502194c6d046c8	7000	Available	2020-11-17	5fb36db588b3a6c245b4a83f	Wireless earpods with dual mic and IPX7 rating
5fb39ccc47c2b7afb899d245	Infinity Glide 4000	5f9bd5ff5a502194c6d046c8	3600	Available	2020-11-17	5fb36db588b3a6c245b4a83f	Over-ear wireless bluetooth headphone with mic
5fb39d1147c2b7afb899d246	Boat Nirvana 715	5f9bd5ff5a502194c6d046c8	4400	Available	2020-11-17	5fb36db588b3a6c245b4a83f	Active Noise Cancellation Bluetooth headphones
\.


--
-- Data for Name: shippers; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.shippers (id, name, email, website, country_code, created_at, password, emp_id, status) FROM stdin;
5f99a447ab95f7e233c2f726	J Morgan	jmorgan@gmail.com	jmorgan.com	IN	2020-10-28	$2a$10$rD9eu75ksLTnZoBybdy1R.2rlZIYOi8jGsxDxy7FxLSuGtQ/SNnL2	5f99a2d9ab95f7e233c2f722	t
5f9bb3d7ea5bf428f628107a	karan kangude	karankangude17@gmail.com	kk.com	IN	2020-10-30	$2a$10$4aqmtMi6j0116pSEzb92DeYMg0Yfttlq9Gz6VftLpjF4rBeN9Ie66	5f99a2d9ab95f7e233c2f722	t
5f9d6408a82a54c9806e20d5	Ariah Garner	ag@gmail.com	ag.com	US	2020-10-31	$2a$10$6RRfc3DNJ5b5Ua0XX/9XX.OcrVXMf8J.kVEDCi8ouCHiOsKkX9W2y	5f9bb55d964361c2ad39ba70	f
5f9d6436a82a54c9806e20d7	Beatriz Clarkson	bc@gmail.com	bc.com	US	2020-10-31	$2a$10$Ik2skKKsOzrTwEnXpE8HPePE2XvT8Fhi9vgKUN.JnF6CBoWqiGHNO	5f9bb55d964361c2ad39ba70	f
5f9d644da82a54c9806e20d8	Pierre Lawrence	pl@gmail.com	pl.com	US	2020-10-31	$2a$10$hpa1Hhy1yRmwlBo5YUNKlOoh1MN0g6F/8habSGCfAKgjHFnluVzae	5f9bb55d964361c2ad39ba70	f
5f9d645da82a54c9806e20d9	Alissia Smith	as@gmail.com	as.com	US	2020-10-31	$2a$10$cD2Qhr67rJQO8gvFg1hXwuMP7LcLgN//fJC8De.9knZn1e/Uu4.CW	5f9bb55d964361c2ad39ba70	f
5f9d6479a82a54c9806e20da	Cillian Terry	ct@gmail.com	ct.com	US	2020-10-31	$2a$10$oLcapfYlTWtVh45Uekgdn.IcEx7H/YNkLyuTsxmpq1D7PyjChYhP6	5f9bb55d964361c2ad39ba70	f
5f9d64a1a82a54c9806e20db	Joan Schmidt	js@gmail.com	js.com	US	2020-10-31	$2a$10$Bd0zwSjeR60l5H0dFjb4wOGeYs9Q7W8U8.HeS0aZPURlZ8iRW1Bra	5f9bb55d964361c2ad39ba70	f
5f9d64b0a82a54c9806e20dc	Daisy Knott	dk@gmail.com	dk.com	US	2020-10-31	$2a$10$YUdfSG5jJc3JnqCA3L2pCOLyFzlZrID.zcvKaAPqZJIdEOmlcSXIG	5f9bb55d964361c2ad39ba70	f
5f9d6420a82a54c9806e20d6	Richard Goulding	rg@gmail.com	rg.com	US	2020-10-31	$2a$10$LKpzXWqOWq46Z0rQfB/bneckTRlCVITIq5o7h1owCezUYFMTwJUOW	5f9bb55d964361c2ad39ba70	t
5f9d6520a82a54c9806e20e0	Silas Costa	sc@gmail.com	sc.com	US	2020-10-31	$2a$10$ZzfBd3Wa555fToIvYPolo.zETi3ITJyYPT9UNqt9ImJ5XJz00KHrG	5f9bb55d964361c2ad39ba70	t
5f9d6534a82a54c9806e20e1	Alisa Curtis	ac@gmail.com	ac.com	US	2020-10-31	$2a$10$7dXv2YS7LqqdlKqozbdK4.SQDlTrA/kZdcuwmFWecZBFrvA7ENhuG	5f9bb55d964361c2ad39ba70	t
5f9d6548a82a54c9806e20e2	Dan Watt	dw@gmail.com	dw.com	US	2020-10-31	$2a$10$Givfc1zXM2642vzzJycmQ.w.5d5J0VexVnUBNbNcTrsybepmlLGF6	5f9bb55d964361c2ad39ba70	t
5f9d6509a82a54c9806e20df	Aleena Mcgregor	ak@gmail.com	ak.com	US	2020-10-31	$2a$10$7RMV3CxxjTMFik4m6Hj8Ie47UKVhl26U5bNxos5dq8MxTi6EtMw8q	5f9bb55d964361c2ad39ba70	t
5f9d64e4a82a54c9806e20dd	Kara Campbell	kc@gmail.com	kc.com	US	2020-10-31	$2a$10$z5urqKyd6gg/DXR9fepaveFrp8RarTWt/vq0Tz9XCq8CniDHzXQxC	5f9bb55d964361c2ad39ba70	t
5fab708030e08d2f5714f048	john doe	johndoe@gmail.com	https://pict.edu/	IN	2020-11-11	$2a$10$9.B3kR2knU6DvKCD9LbO4uM2wZTySe6GUnvL.truMtHcsipATg/96	5f99a2f7ab95f7e233c2f723	f
5fac368ba6df8f34e4192070	karan kangude	karankangude18@gmail.com	https://pict.edu/	IN	2020-11-11	$2a$10$PuhThDJlroK.EPRhiFwBUuRlXBBlINbUvw1MUrIy6bReOAIlLUgrm	5f99a2f7ab95f7e233c2f723	f
5fa8cce51aae3f1c90c4e2f4	shipper 1	shipper1@gmail.com	https://pict.edu/	IN	2020-11-09	$2a$10$RCu92MozrbkHkjejoqLe..BKMiBl76rJVEleL/XDc9jLDn2yRGKHG	5f99a2d9ab95f7e233c2f722	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sgykafkphqhreq
--

COPY public.users (id, name, email, gender, phone, "walletAmt", date_of_birth, created_at, country_code, password) FROM stdin;
5f9a9039ddbdf8e802e8aef3	John Doe	john@doe.com	Male	9119119119	0	2020-10-29	2020-10-29	US	$2a$10$NiUCyIGOoEXAqdS8G2KZbezw9GekO8CNza33FjV5.qxvRex9sTY3O
5fbb80a23311e27bd07c94fb	Sheldon	shell@gmail.com	Male	9911881122	0	2001-03-04	2020-11-23	IN	$2a$10$uNvuQ6g/hCm8iBl4ayzuq.fJG4HjcKDrfI5/67cEeHzYdi0wQ1qr2
5fbbc80e65039c182f7626af	joe smith	joesmith@gmail.com	male	8624891545	0	2020-07-07	2020-11-23	IN	$2a$10$RZGFHrQ/rLVBSdSUSZRfQeScGK7s8ff7ldTUiHtdWMSnFk5uKmtfK
\.


--
-- Name: categories categories_cat_name_key; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_cat_name_key UNIQUE (cat_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (code);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: merchants merchants_email_key; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_email_key UNIQUE (email);


--
-- Name: merchants merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: shippers shippers_email_key; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.shippers
    ADD CONSTRAINT shippers_email_key UNIQUE (email);


--
-- Name: shippers shippers_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.shippers
    ADD CONSTRAINT shippers_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: employees employees_country_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_country_code_fkey FOREIGN KEY (country_code) REFERENCES public.countries(code);


--
-- Name: merchants merchants_country_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_country_code_fkey FOREIGN KEY (country_code) REFERENCES public.countries(code);


--
-- Name: merchants merchants_emp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_shipper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipper_id_fkey FOREIGN KEY (shipper_id) REFERENCES public.shippers(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products products_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(id);


--
-- Name: shippers shippers_country_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.shippers
    ADD CONSTRAINT shippers_country_code_fkey FOREIGN KEY (country_code) REFERENCES public.countries(code);


--
-- Name: shippers shippers_emp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.shippers
    ADD CONSTRAINT shippers_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(id);


--
-- Name: users users_country_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sgykafkphqhreq
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_country_code_fkey FOREIGN KEY (country_code) REFERENCES public.countries(code);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: sgykafkphqhreq
--

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO sgykafkphqhreq;


--
-- PostgreSQL database dump complete
--

