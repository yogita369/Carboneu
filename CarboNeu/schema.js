const Joi = require('joi');

//analytics
module.exports.emissionAnalytics= Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid userId format — must be a MongoDB ObjectId',
      'any.required': 'userId is required'
    }),
  totalEmission: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'totalEmission must be a number',
      'any.required': 'totalEmission is required'
    }),
  breakdown: Joi.object({
    energy: Joi.number().min(0).default(0),
    travel: Joi.number().min(0).default(0),
    fuel: Joi.number().min(0).default(0),
    food: Joi.number().min(0).default(0),
    others: Joi.number().min(0).default(0)
  }).default({}),

  date: Joi.date().default(() => new Date(), 'current date')
});

//input
module.exports.combustionInput = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid userId format — must be a MongoDB ObjectId',
      'any.required': 'userId is required'
    }),

  date: Joi.date().default(() => new Date(), 'current date'),

  // ⚡ Energy usage (array of objects)
  energyUsage: Joi.array()
    .items(
      Joi.object({
        applianceName: Joi.string().required().messages({
          'any.required': 'applianceName is required'
        }),
        hoursPerDay: Joi.number().min(0).required().messages({
          'any.required': 'hoursPerDay is required',
          'number.base': 'hoursPerDay must be a number'
        })
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'energyUsage must be an array of objects',
      'array.min': 'At least one energyUsage entry is required'
    }),

  // 🛞 Transport (all numeric, optional, defaults to 0)
  transport: Joi.object({
    airplaneKm: Joi.number().min(0).default(0),
    railwayKm: Joi.number().min(0).default(0),
    metroKm: Joi.number().min(0).default(0),
    busKm: Joi.number().min(0).default(0),
    electricBusKm: Joi.number().min(0).default(0),
    cabKm: Joi.number().min(0).default(0),
    electricCabKm: Joi.number().min(0).default(0)
  }).default({}),

  // ⛽ Solid fuels (kg)
  solidFuels: Joi.object({
    lpgKg: Joi.number().min(0).default(0),
    cngKg: Joi.number().min(0).default(0),
    coalKg: Joi.number().min(0).default(0),
    woodKg: Joi.number().min(0).default(0)
  }).default({}),

  // 🛢️ Liquid fuels (liters)
  liquidFuels: Joi.object({
    petrolL: Joi.number().min(0).default(0),
    dieselL: Joi.number().min(0).default(0),
    lpgL: Joi.number().min(0).default(0),
    cngL: Joi.number().min(0).default(0)
  }).default({})
});

//users
module.exports.userValidation = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid userId format — must be a MongoDB ObjectId'
    }),
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should have at least 2 characters'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  // ⚡ Energy Appliances (list of up to 5)
  energy: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          'any.required': 'Appliance name is required'
        }),
        powerKWh: Joi.number().min(0).required().messages({
          'any.required': 'Power (kWh) is required'
        }),
        starRating: Joi.number().integer().min(1).max(5).required().messages({
          'number.min': 'Star rating must be between 1 and 5',
          'number.max': 'Star rating must be between 1 and 5'
        })
      })
    )
    .max(5)
    .required()
    .messages({
      'array.base': 'Energy must be an array of appliances',
      'array.max': 'You can list a maximum of 5 appliances'
    }),
  // 🍽️ Food Choice
  foodChoice: Joi.object({
    type: Joi.string()
      .valid('vegan', 'vegetarian', 'non-vegetarian')
      .required()
      .messages({
        'any.only': 'Food type must be vegan, vegetarian, or non-vegetarian',
        'any.required': 'Food type is required'
      }),

    frequency: Joi.when('type', {
      is: 'non-vegetarian',
      then: Joi.string()
        .valid('most', 'some', 'rare')
        .required()
        .messages({
          'any.only': 'Frequency must be most, some, or rare',
          'any.required': 'Frequency is required for non-vegetarians'
        }),
      otherwise: Joi.forbidden()
    })
  }).required(),
  // 🔋 Energy Source
  usesNonRenewableEnergy: Joi.boolean()
    .required()
    .messages({
      'any.required': 'usesNonRenewableEnergy is required'
    }),
  renewableEnergyPercent: Joi.when('usesNonRenewableEnergy', {
    is: true,
    then: Joi.number()
      .valid(25, 50, 75, 100)
      .required()
      .messages({
        'any.only': 'RenewableEnergyPercent must be 25, 50, 75, or 100',
        'any.required': 'renewableEnergyPercent is required when non-renewable energy is used'
      }),
    otherwise: Joi.forbidden()
  })
});

