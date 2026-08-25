import clientPromise from "../mongodb"

export async function getSiteVisits(
  days = 60
) {
  const startDate = new Date()

  startDate.setDate(
    startDate.getDate() - (days - 1)
  )

  startDate.setHours(0, 0, 0, 0)

  const client = await clientPromise

  const db = client.db(
    process.env.MONGODB_DB
  )

  return db
    .collection("analytics_visits")
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },

      {
        $group: {
          _id: {
            date: "$date",
            deviceType: "$deviceType",
          },

          count: {
            $sum: 1,
          },
        },
      },

      {
        $group: {
          _id: "$_id.date",

          desktop: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$_id.deviceType",
                    "desktop",
                  ],
                },
                "$count",
                0,
              ],
            },
          },

          mobile: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$_id.deviceType",
                    "mobile",
                  ],
                },
                "$count",
                0,
              ],
            },
          },

          tablet: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$_id.deviceType",
                    "tablet",
                  ],
                },
                "$count",
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          desktop: 1,
          mobile: 1,
          tablet: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ])
    .toArray()
}