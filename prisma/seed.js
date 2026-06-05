require("dotenv").config();

const { prisma } = require("../src/config/db");

const creatorId = "41904824-0031-409a-8401-ddd674d7136c";

const movies = [
  {
    title: "The Matrix",
    overview: "A computer hacker learns about the true nature of reality.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl: "https://example.com/matrix.jpg",
    createdBy: creatorId,
  },
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    posterUrl: "https://example.com/inception.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Dark Knight",
    overview: "Batman faces the Joker in a battle for Gotham's soul.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl: "https://example.com/darkknight.jpg",
    createdBy: creatorId,
  },
  {
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, and others intertwine.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    runtime: 154,
    posterUrl: "https://example.com/pulpfiction.jpg",
    createdBy: creatorId,
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl: "https://example.com/interstellar.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    posterUrl: "https://example.com/shawshank.jpg",
    createdBy: creatorId,
  },
  {
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
    releaseYear: 1999,
    genres: ["Drama"],
    runtime: 139,
    posterUrl: "https://example.com/fightclub.jpg",
    createdBy: creatorId,
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    runtime: 142,
    posterUrl: "https://example.com/forrestgump.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control to his son.",
    releaseYear: 1972,
    genres: ["Crime", "Drama"],
    runtime: 175,
    posterUrl: "https://example.com/godfather.jpg",
    createdBy: creatorId,
  },
  {
    title: "Goodfellas",
    overview: "The story of Henry Hill and his life in the mob.",
    releaseYear: 1990,
    genres: ["Biography", "Crime", "Drama"],
    runtime: 146,
    posterUrl: "https://example.com/goodfellas.jpg",
    createdBy: creatorId,
  },
];

async function main() {
  console.log("Seeding movies...");
  for (const movie of movies) {
    const data = {
      title: movie.title,
      overview: movie.overview,
      releaseYear: new Date(`${movie.releaseYear}-01-01`),
      genre: movie.genres.join(", "),
      runtime: movie.runtime,
      posterUrl: movie.posterUrl,
      createdBy: movie.createdBy,
    };

    const existingMovies = await prisma.movie.findMany({
      where: {
        title: movie.title,
        createdBy: movie.createdBy,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (existingMovies.length === 0) {
      await prisma.movie.create({ data });
      continue;
    }

    const [movieToKeep, ...duplicates] = existingMovies;

    await prisma.movie.update({
      where: { id: movieToKeep.id },
      data,
    });

    if (duplicates.length > 0) {
      await prisma.movie.deleteMany({
        where: {
          id: {
            in: duplicates.map((duplicate) => duplicate.id),
          },
        },
      });
    }
  }
  console.log("Finished seeding movies.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
