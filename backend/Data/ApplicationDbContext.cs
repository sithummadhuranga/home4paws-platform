using Microsoft.EntityFrameworkCore;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IWebHostEnvironment _environment;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IWebHostEnvironment environment) 
            : base(options)
        {
            _environment = environment;
        }

        // DbSets for your entities
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserSession> UserSessions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure schema based on environment
            var schema = _environment.IsDevelopment() ? "development" : "production";
            modelBuilder.HasDefaultSchema(schema);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FirstName).HasColumnName("first_name").HasMaxLength(50).IsRequired();
                entity.Property(e => e.LastName).HasColumnName("last_name").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(500).IsRequired();
                entity.Property(e => e.Role).HasColumnName("role").HasMaxLength(20).HasDefaultValue("User");
                entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.Property(e => e.EmailVerified).HasColumnName("email_verified").HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.LastLoginAt).HasColumnName("last_login_at");

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.IsActive);
            });

            // Configure UserSession entity
            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.ToTable("user_sessions");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
                entity.Property(e => e.Token).HasColumnName("token").IsRequired();
                entity.Property(e => e.RefreshToken).HasColumnName("refresh_token").HasMaxLength(500).IsRequired();
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at").IsRequired();
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.Property(e => e.DeviceInfo).HasColumnName("device_info");
                entity.Property(e => e.IpAddress).HasColumnName("ip_address").HasMaxLength(45);

                entity.HasIndex(e => e.RefreshToken).IsUnique();
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.ExpiresAt);

                // Foreign key relationship
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Sessions)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}