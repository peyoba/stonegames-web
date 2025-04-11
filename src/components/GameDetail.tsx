interface GameDetailProps {
  game: {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    imageUrl: string;
    category: {
      id: string;
      name: string;
      nameEn: string;
      icon: string;
    };
    tags: string[];
    content: string;
    contentEn: string;
  };
}

export default function GameDetail({ game }: GameDetailProps) {
  return (
    <div className="game-detail">
      <div className="game-header">
        <h1>{game.title}</h1>
        <div className="game-category">
          <span className="category-icon">{game.category.icon}</span>
          <span>{game.category.name}</span>
        </div>
      </div>
      
      <div className="game-image">
        <img src={game.imageUrl} alt={game.title} />
      </div>
      
      <div className="game-description">
        <p>{game.description}</p>
      </div>
      
      {game.tags && game.tags.length > 0 && (
        <div className="game-tags">
          {game.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="game-content">
        <div dangerouslySetInnerHTML={{ __html: game.content }} />
      </div>
    </div>
  );
} 